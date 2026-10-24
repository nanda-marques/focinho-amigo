import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Administrador from "../models/Administrador.js";
import Cargo from "../models/Cargo.js";
import { HttpError } from "../middlewares/error.middleware.js";
import { obterJwtSecret } from "../middlewares/auth.middleware.js";
import {
  permissoesDe,
  adminParaUsuario,
  type CorpoCadastro,
  type CorpoLogin,
  type PayloadToken,
} from "../types/auth.types.js";

export const authController = {
  // POST /api/auth/cadastro
  async cadastrar(
    req: Request<unknown, unknown, CorpoCadastro>,
    res: Response
  ): Promise<void> {
    const { nome, sobrenome, email, cargo, senha } = req.body;

    if (!nome?.trim() || !sobrenome?.trim() || !email?.trim() || !cargo || !senha) {
      throw new HttpError(400, "Preencha todos os campos obrigatórios.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new HttpError(400, "E-mail inválido.");
    }
    if (senha.length < 8) {
      throw new HttpError(400, "A senha deve ter pelo menos 8 caracteres.");
    }

    const cargoRef = await Cargo.findOne({ where: { nomeCargo: cargo } });
    if (!cargoRef) throw new HttpError(400, "Cargo inválido.");

    const existe = await Administrador.findOne({ where: { email } });
    if (existe) throw new HttpError(409, "Este e-mail já está cadastrado.");

    const senhaHash = await bcrypt.hash(senha, 10);
    const admin = await Administrador.create({
      nomeCompleto: `${nome} ${sobrenome}`.trim(),
      email,
      senhaHash,
      cargo: cargoRef.id,
    });

    res.status(201).json({
      mensagem: "Conta criada com sucesso.",
      usuario: adminParaUsuario(admin, cargoRef),
    });
  },

  // POST /api/auth/login
  async login(
    req: Request<unknown, unknown, CorpoLogin>,
    res: Response
  ): Promise<void> {
    const { email, senha } = req.body;

    if (!email || !senha) {
      throw new HttpError(400, "E-mail e senha são obrigatórios.");
    }

    const admin = await Administrador.findOne({
      where: { email },
      include: [{ model: Cargo, as: "cargoRef" }],
    });

    if (!admin || !admin.ativo) {
      throw new HttpError(401, "E-mail ou senha incorretos.");
    }

    const senhaValida = await bcrypt.compare(senha, admin.senhaHash);
    if (!senhaValida) {
      throw new HttpError(401, "E-mail ou senha incorretos.");
    }

    const cargoRef = admin.get("cargoRef") as Cargo | undefined;

    const payload: PayloadToken = {
      id: admin.id,
      email: admin.email,
      cargo: cargoRef?.nomeCargo ?? String(admin.cargo),
    };

    const token = jwt.sign(payload, obterJwtSecret(), { expiresIn: "8h" });

    res.json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: {
        ...adminParaUsuario(admin, cargoRef),
        permissoes: permissoesDe(cargoRef ?? null),
      },
    });
  },

  // GET /api/auth/me  (bônus — frontend usa para revalidar sessão)
  async me(req: Request, res: Response): Promise<void> {
    const u = req.usuario;
    if (!u) throw new HttpError(401, "Não autenticado.");

    const admin = await Administrador.findByPk(u.id, {
      include: [{ model: Cargo, as: "cargoRef" }],
    });
    if (!admin || !admin.ativo) throw new HttpError(401, "Sessão inválida.");

    const cargoRef = admin.get("cargoRef") as Cargo | undefined;

    res.json({
      usuario: {
        ...adminParaUsuario(admin, cargoRef),
        permissoes: permissoesDe(cargoRef ?? null),
      },
    });
  },
};