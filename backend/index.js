// src/index.js
import express from "express";
import cors from "cors";

// Importação das rotas
import productsRoutes from "./src/routes/products.js";
import authRoutes from "./src/routes/auth.js";
import reviewsRoutes from "./src/routes/reviews.js";
import userRoutes from "./src/routes/user.js";
import checkoutRoutes from "./src/routes/checkout.js";

const app = express();

// Middlewares globais
app.use(cors());           // Permite requisições de outras origens
app.use(express.json());   // Faz o parsing do JSON nas requisições

// Rotas da aplicação
app.use("/products", productsRoutes);
app.use("/auth", authRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/users", userRoutes);
app.use("/checkout", checkoutRoutes);

/**
 * Rota de teste básico para verificar se o backend está funcionando
 */
app.get("/", (req, res) => res.send("Backend funcionando!"));

// Inicia o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
