import express from "express";
import cors from "cors";
import publicacoesRoutes from "./publicacoes.routes.js";
import animaisRoutes from "./animais.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Rotas
app.use("/api/publicacoes", publicacoesRoutes);
app.use("/api/animais", animaisRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});