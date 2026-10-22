import express from "express";
import cors from "cors";

import publicacoesRoutes from "./routes/publicacoes.routes.js";
import animaisRoutes from "../src/routes/animais.routes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/publicacoes", publicacoesRoutes);
app.use("/api/animais", animaisRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});