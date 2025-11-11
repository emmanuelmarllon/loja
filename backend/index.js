import express, { response } from "express";
import cors from "cors";
import routes from "./src/routes/index.js";
import { Payment } from "mercadopago";

const PORT = process.env.PORT;
const app = express();
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// app.get("/api/getpayment", async (req, res) => {
//   try {
//     const payment = new Payment({
//       accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
//     });

//     const information = await payment.get({
//       id: req.headers.paymentid,
//     });

//     res.status(200).send({ response: information });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error: "Erro ao buscar pagamento" });
//   }
// });

// app.put("/api/updatepayment", async (req, res) => {
//   await new payment({
//     accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
//   }).create({
//     body{
//         traansaction_amount: Number(req.headers.value),
//         payment_method_id: pix,
//         payer:{
//             email: "teste@gmail.com",
//         }
//     }
//   });
// });

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api", routes);
