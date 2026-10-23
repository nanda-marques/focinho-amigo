import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import cors from "cors";

import sequelize from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import publicacoesRoutes from "./routes/publicacoes.routes.js";
import animaisRoutes from "./routes/animais.routes.js";
import { seedCargos } from "./seed/cargos.js";
import adminRoutes from "./routes/admin.routes.js";

import "./models/index.js";   

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL ?? "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Rotas

app.use("/api/auth", authRoutes);
app.use("/api/publicacoes", publicacoesRoutes);
app.use("/api/animais", animaisRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_req: Request, res: Response): void => {
  res.json({ ok: true, servico: "focinho-amigo-backend" });
});

app.use((_req: Request, res: Response): void => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

async function iniciar(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("Banco de dados conectado com sucesso.");

    await sequelize.sync();
    console.log("Tabelas sincronizadas com sucesso.");

    await seedCargos();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (erro: unknown) {
    console.error("Erro ao iniciar o servidor:", erro);
    process.exit(1);
  }
}

iniciar();