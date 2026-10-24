import "dotenv/config";
import express from "express";
import cors from "cors";

import "./models/index.js"; 
import sequelize from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import publicacoesRoutes from "./routes/publicacoes.routes.js";
import animaisRoutes from "./routes/animais.routes.js";

import { tratarErros } from "./middlewares/error.middleware.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/publicacoes", publicacoesRoutes);
app.use("/api/animais", animaisRoutes);

app.use(tratarErros);

sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(() => app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`)))
  .catch((err) => {
    console.error("Erro ao conectar ao banco (Aiven):", err);
    process.exit(1);
  });