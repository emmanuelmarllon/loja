import { prisma } from "../utils/prisma.js";

// Função auxiliar para padronizar resposta
const buildResponse = (status, data) => ({ status, data });

// CRUD Produtos
export const getAllProducts = async () => {
  try {
    const products = await prisma.produtos.findMany();
    return buildResponse(200, products);
  } catch (err) {
    return buildResponse(500, { error: err.message });
  }
};

export const getProductById = async (id) => {
  try {
    const product = await prisma.produtos.findUnique({ where: { id } });
    if (!product)
      return buildResponse(404, { error: "Produto não encontrado" });
    return buildResponse(200, product);
  } catch (err) {
    return buildResponse(500, { error: err.message });
  }
};

export const createProduct = async (productData) => {
  try {
    const productsArray = Array.isArray(productData)
      ? productData
      : [productData];
    const result = [];

    for (const product of productsArray) {
      const created = await prisma.produtos.create({
        data: {
          ...product,
          details: product.details || [],
          gallery: product.gallery || [],
        },
      });
      result.push(created);
    }

    return buildResponse(201, result);
  } catch (err) {
    return buildResponse(500, { error: err.message });
  }
};

export const updateProduct = async (id, data) => {
  try {
    const updated = await prisma.produtos.update({
      where: { id },
      data: {
        ...data,
        details: data.details || [],
        gallery: data.gallery || [],
      },
    });
    return buildResponse(200, updated);
  } catch (err) {
    if (err.code === "P2025")
      return buildResponse(404, { error: "Produto não encontrado" });
    return buildResponse(500, { error: err.message });
  }
};

export const deleteProduct = async (id) => {
  try {
    const deleted = await prisma.produtos.delete({ where: { id } });
    return buildResponse(200, deleted);
  } catch (err) {
    if (err.code === "P2025")
      return buildResponse(404, { error: "Produto não encontrado" });
    return buildResponse(500, { error: err.message });
  }
};
