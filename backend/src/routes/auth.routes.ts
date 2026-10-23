import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Administrador from "../models/Administrador.js";
import Cargo from "../models/Cargo.js";

const router = Router();

interface CorpoCadastro {
  nome?: string;
  sobrenome?: string;
  email?: string;
  cargo?: string;
  senha?: string;
}

interface CorpoLogin {
  email?: string;
  senha?: string;
}

interface PayloadToken {
  id: number;
  email: string;
  cargo: string;
}

function obterJwtSecret(): string {
  const segredo = process.env.JWT_SECRET;
  if (!segredo) {
    throw new Error("JWT_SECRET não definido no .env.");
  }
  return segredo;
}

// Cadastro 

router.post(
  "/cadastro",
  async (
    req: Request<unknown, unknown, CorpoCadastro>,
    res: Response
  ): Promise<void> => {
    try {
      const { nome, sobrenome, email, cargo, senha } = req.body;

      if (
        !nome?.trim() ||
        !sobrenome?.trim() ||
        !email?.trim() ||
        !cargo ||
        !senha
      ) {
        res.status(400).json({
          mensagem: "Preencha todos os campos obrigatórios.",
        });
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({ mensagem: "E-mail inválido." });
        return;
      }

      if (senha.length < 8) {
        res.status(400).json({
          mensagem: "A senha deve ter pelo menos 8 caracteres.",
        });
        return;
      }

      const cargoRef = await Cargo.findOne({ where: { nomeCargo: cargo } });
      if (!cargoRef) {
        res.status(400).json({ mensagem: "Cargo inválido." });
        return;
      }

      const existe = await Administrador.findOne({ where: { email } });
      if (existe) {
        res.status(409).json({
          mensagem: "Este e-mail já está cadastrado.",
        });
        return;
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      const admin = await Administrador.create({
        nomeCompleto: `${nome} ${sobrenome}`.trim(),
        email,
        senhaHash,
        cargo: cargoRef.id,
      });

      res.status(201).json({
        mensagem: "Conta criada com sucesso.",
        usuario: {
          id: admin.id,
          nomeCompleto: admin.nomeCompleto,
          email: admin.email,
          cargo: cargoRef.nomeCargo,
        },
      });
    } catch (erro: unknown) {
      console.error("Erro no cadastro:", erro);
      res.status(500).json({ mensagem: "Erro ao criar conta." });
    }
  }
);

// Login

router.post(
  "/login",
  async (
    req: Request<unknown, unknown, CorpoLogin>,
    res: Response
  ): Promise<void> => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        res.status(400).json({
          mensagem: "E-mail e senha são obrigatórios.",
        });
        return;
      }

      const admin = await Administrador.findOne({
        where: { email },
        include: [{ model: Cargo, as: "cargoRef" }],
      });

      if (!admin || !admin.ativo) {
        res.status(401).json({
          mensagem: "E-mail ou senha incorretos.",
        });
        return;
      }

      const senhaValida = await bcrypt.compare(senha, admin.senhaHash);
      if (!senhaValida) {
        res.status(401).json({
          mensagem: "E-mail ou senha incorretos.",
        });
        return;
      }

      const cargoRef = admin.get("cargoRef") as Cargo | undefined;

      const payload: PayloadToken = {
        id: admin.id,
        email: admin.email,
        cargo: cargoRef?.nomeCargo ?? String(admin.cargo),
      };

      const token = jwt.sign(payload, obterJwtSecret(), {
        expiresIn: "8h",
      });

      res.json({
        mensagem: "Login realizado com sucesso.",
        token,
        usuario: {
          id: admin.id,
          nomeCompleto: admin.nomeCompleto,
          email: admin.email,
          cargo: cargoRef?.nomeCargo ?? null,
          permissoes: cargoRef
            ? {
                animais: cargoRef.podeGerenciarAnimais,
                conteudo: cargoRef.podeGerenciarConteudo,
                newsletter: cargoRef.podeGerenciarNewsletter,
                admins: cargoRef.podeGerenciarAdmins,
              }
            : null,
        },
      });
    } catch (erro: unknown) {
      console.error("Erro no login:", erro);
      res.status(500).json({ mensagem: "Erro ao realizar login." });
    }
  }
);

export default router;