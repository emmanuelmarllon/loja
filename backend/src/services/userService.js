import { prisma } from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// REGISTER
export const registerUser = async ({ name, user, email, password }) => {
  const existingUser = await prisma.usuario.findFirst({
    where: { OR: [{ user }, { email }] },
  });
  if (existingUser) throw new Error("Usuário ou email já cadastrado");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.usuario.create({
    data: { name, user, email, password: hashedPassword },
    select: { id: true, name: true, user: true, email: true, isAdmin: true },
  });

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { user: newUser, token };
};

// LOGIN
export const loginUser = async ({ identifier, password }) => {
  const user = await prisma.usuario.findFirst({
    where: { OR: [{ user: identifier }, { email: identifier }] },
  });
  if (!user) throw new Error("Usuário não encontrado");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Senha incorreta");

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

  return {
    user: {
      id: user.id,
      name: user.name,
      user: user.user,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    token,
  };
};

// GET ME
export const getMe = async (userId) => {
  if (!userId) throw new Error("Usuário não logado");

  const user = await prisma.usuario.findUnique({
    where: { id: userId },
    select: { id: true, user: true, name: true, email: true, isAdmin: true },
  });
  if (!user) throw new Error("Usuário não encontrado");

  return user;
};

// GET ALL USERS
export const getAllUsers = async () => {
  const users = await prisma.usuario.findMany({
    select: { id: true, user: true, name: true, email: true, isAdmin: true },
  });
  return users;
};
