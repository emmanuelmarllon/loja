import { prisma } from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = "segredo_super_secreto"; // No real use env var

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    console.log("Recebendo dados de registro:", { email, name }); // log dos dados recebidos

    const existingUser = await prisma.usu_rios_.findUnique({
      where: { email },
    });
    if (existingUser) {
      console.log("Usuário já existe:", email); // log se o usuário já existe
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Senha hasheada:", hashedPassword); // log da senha criptografada

    const now = new Date();
    const brasiliaTime = new Date(
      now.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    );

    const user = await prisma.usu_rios_.create({
      data: {
        email,
        password: hashedPassword,
        name,
        IsAdmin: false,
        createdAt: brasiliaTime,
      },
    });

    // Converte para horário de Brasília
    const createdAtBrasilia = user.createdAt.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    console.log("Data em Brasília:", createdAtBrasilia);

    console.log("Usuário criado com sucesso:", user); // log do usuário criado
    res.status(201).json({ message: "Usuário criado", userId: user.id });
  } catch (err) {
    console.error("Erro no register:", err); // log detalhado do erro
    res.status(500).json({ error: "Erro interno" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Tentativa de login:", email); // log do email que tentou logar

    const user = await prisma.usu_rios_.findUnique({ where: { email } });
    if (!user) {
      console.log("Usuário não encontrado:", email);
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Senha inválida para:", email);
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });
    console.log("Login bem-sucedido:", user.id);
    res.json({ message: "Logado com sucesso", token });
  } catch (err) {
    console.error("Erro no login:", err); // log detalhado do erro
    res.status(500).json({ error: "Erro interno" });
  }
};

export const me = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, SECRET);
    const user = await prisma.usu_rios_.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
    router.get("/me", async (req, res) => {
      const authHeader = req.headers.authorization;
      if (!authHeader)
        return res.status(401).json({ error: "Token não fornecido" });

      const token = authHeader.split(" ")[1];
      try {
        const payload = jwt.verify(token, SECRET);
        const user = await prisma.usu_rios_.findUnique({
          where: { id: payload.userId },
        });
        if (!user)
          return res.status(404).json({ error: "Usuário não encontrado" });
        res.json({ user });
      } catch (err) {
        res.status(401).json({ error: "Token inválido" });
      }
    });
    router.get("/me", async (req, res) => {
      const authHeader = req.headers.authorization;
      if (!authHeader)
        return res.status(401).json({ error: "Token não fornecido" });

      const token = authHeader.split(" ")[1];

      try {
        const payload = jwt.verify(token, SECRET);
        const user = await prisma.usu_rios_.findUnique({
          where: { id: payload.userId },
          select: { id: true, name: true, email: true }, // só o necessário
        });

        if (!user)
          return res.status(404).json({ error: "Usuário não encontrado" });

        res.json({ user });
      } catch (err) {
        res.status(401).json({ error: "Token inválido" });
      }
    });
  }
};
