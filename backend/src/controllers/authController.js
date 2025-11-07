// src/controllers/authController.js
import { prisma } from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Chave secreta para JWT
const SECRET = process.env.JWT_SECRET;

/**
 * Registrar um novo usuário
 */
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await prisma.usu_rios_.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Define a data de criação no horário de Brasília
    const now = new Date();
    const brasiliaTime = new Date(
      now.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    );

    // Cria o usuário no banco
    const user = await prisma.usu_rios_.create({
      data: {
        email,
        password: hashedPassword,
        name,
        IsAdmin: false,
        createdAt: brasiliaTime,
      },
    });

    res.status(201).json({ message: "Usuário criado", userId: user.id });
  } catch (err) {
    res.status(500).json({ error: "Erro interno" });
  }
};

/**
 * Login de usuário
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca usuário pelo email
    const user = await prisma.usu_rios_.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    // Verifica senha
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    // Gera token JWT válido por 1 hora
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });

    res.json({ message: "Logado com sucesso", token });
  } catch (err) {
    res.status(500).json({ error: "Erro interno" });
  }
};

/**
 * Retorna os dados do usuário autenticado
 */
export const me = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, SECRET);

    const user = await prisma.usu_rios_.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        IsAdmin: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ user });
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
};

/**
 * Middleware de autenticação
 */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};

/**
 * Retorna histórico de compras de um usuário
 */
export const getPurchases = async (req, res) => {
  try {
    const userId = req.params.id;

    const purchases = await prisma.purchase.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(Array.isArray(purchases) ? purchases : []);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao buscar compras", details: err.message });
  }
};

/**
 * Processa o checkout de compras
 */
export const checkoutController = async (req, res) => {
  try {
    const userId = req.userId;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Nenhum produto informado" });
    }

    // Busca compras anteriores para validar duplicidade
    const previousPurchases = await prisma.purchase.findMany({
      where: { userId },
    });
    const boughtProductIds = previousPurchases.flatMap((p) =>
      p.items.map((i) => i.productId)
    );

    const purchaseItems = [];

    for (const item of items) {
      if (boughtProductIds.includes(item.productId)) {
        return res
          .status(400)
          .json({ error: `Você já possui o app com ID ${item.productId}` });
      }

      const product = await prisma.produtos.findUnique({
        where: { id: item.productId },
      });
      if (!product)
        return res
          .status(404)
          .json({ error: `Produto com ID ${item.productId} não encontrado` });

      const finalPrice = Number(
        (product.price * (1 - (product.discount || 0) / 100)).toFixed(2)
      );

      purchaseItems.push({
        productId: product.id,
        name: product.name,
        price: finalPrice,
        quantity: 1,
      });
    }

    const total = purchaseItems.reduce((acc, item) => acc + item.price, 0);

    const purchase = await prisma.purchase.create({
      data: { userId, total, items: purchaseItems },
    });

    res.json({ success: true, purchase });
  } catch (err) {
    res.status(500).json({ error: "Erro ao processar compra" });
  }
};
