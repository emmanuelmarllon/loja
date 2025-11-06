import express from "express";
import cors from "cors";
import productsRoutes from "./src/routes/products.js";
import authRoutes from "./src/routes/auth.js";
import reviewsRoutes from "./src/routes/reviews.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/products", productsRoutes);
app.use("/auth", authRoutes);
app.use("/reviews", reviewsRoutes);

// Teste básico
app.get("/", (req, res) => res.send("Backend funcionando!"));

// Porta
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
