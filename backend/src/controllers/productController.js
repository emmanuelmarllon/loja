import * as productService from "../services/productService.js";

export const getAllProducts = async (req, res) => {
  console.log("[GET ALL PRODUCTS] Requisição recebida");
  const { status, data } = await productService.getAllProducts();
  console.log("[GET ALL PRODUCTS] Resposta:", data);
  res.status(status).json(data);
};

export const getProductById = async (req, res) => {
  console.log("[GET PRODUCT BY ID] ID recebido:", req.params.id);
  const { status, data } = await productService.getProductById(req.params.id);
  console.log("[GET PRODUCT BY ID] Resposta:", data);
  res.status(status).json(data);
};

export const createProduct = async (req, res) => {
  console.log("[CREATE PRODUCT] Dados recebidos:", req.body);
  const { status, data } = await productService.createProduct(req.body);
  console.log("[CREATE PRODUCT] Resposta:", data);
  res.status(status).json(data);
};

export const updateProduct = async (req, res) => {
  console.log("[UPDATE PRODUCT] ID:", req.params.id, "Dados:", req.body);
  const { status, data } = await productService.updateProduct(
    req.params.id,
    req.body
  );
  console.log("[UPDATE PRODUCT] Resposta:", data);
  res.status(status).json(data);
};

export const deleteProduct = async (req, res) => {
  console.log("[DELETE PRODUCT] ID recebido:", req.params.id);
  const { status, data } = await productService.deleteProduct(req.params.id);
  console.log("[DELETE PRODUCT] Resposta:", data);
  res.status(status).json(data);
};
