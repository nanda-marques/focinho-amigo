import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Administrador from "../models/Administrador.js";
import Cargo from "../models/Cargo.js";

const router = Router();

interface JwtPayload {
  id: number;
  email: string;
  cargo: string;
}

// Middleware 

function autenticar(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ mensagem: "Token não enviado." });
    return;
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    (req as Request & { adminId: number }).adminId = payload.id;
    next();
  } catch {
    res.status(401).json({ mensagem: "Token inválido ou expirado." });
  }
}

// GET /api/admin/me 

router.get(
  "/me",
  autenticar,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { adminId } = req as Request & { adminId: number };
      const admin = await Administrador.findByPk(adminId, {
        include: [{ model: Cargo, as: "cargoRef" }],
      });
      if (!admin) {
        res.status(404).json({ mensagem: "Administrador não encontrado." });
        return;
      }
      const cargoRef = admin.get("cargoRef") as Cargo | undefined;
      res.json({
        id: admin.id,
        nomeCompleto: admin.nomeCompleto,
        email: admin.email,
        cargo: cargoRef?.nomeCargo ?? null,
        ativo: admin.ativo,
        criadoEm: admin.criadoEm,
      });
    } catch (erro: unknown) {
      console.error("Erro ao buscar perfil:", erro);
      res.status(500).json({ mensagem: "Erro ao buscar perfil." });
    }
  }
);

// PUT /api/admin/me 

interface CorpoPerfil {
  nomeCompleto?: string;
  email?: string;
}

router.put(
  "/me",
  autenticar,
  async (
    req: Request<unknown, unknown, CorpoPerfil>,
    res: Response
  ): Promise<void> => {
    try {
      const { adminId } = req as Request & { adminId: number };
      const { nomeCompleto, email } = req.body;

      const admin = await Administrador.findByPk(adminId);
      if (!admin) {
        res.status(404).json({ mensagem: "Administrador não encontrado." });
        return;
      }

      if (nomeCompleto !== undefined) {
        if (!nomeCompleto.trim()) {
          res.status(400).json({ mensagem: "Nome não pode ficar vazio." });
          return;
        }
        admin.nomeCompleto = nomeCompleto.trim();
      }

      if (email !== undefined) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          res.status(400).json({ mensagem: "E-mail inválido." });
          return;
        }
        if (email !== admin.email) {
          const existe = await Administrador.findOne({ where: { email } });
          if (existe) {
            res.status(409).json({
              mensagem: "Este e-mail já está em uso.",
            });
            return;
          }
          admin.email = email;
        }
      }

      await admin.save();
      res.json({
        mensagem: "Perfil atualizado com sucesso.",
        usuario: {
          id: admin.id,
          nomeCompleto: admin.nomeCompleto,
          email: admin.email,
        },
      });
    } catch (erro: unknown) {
      console.error("Erro ao atualizar perfil:", erro);
      res.status(500).json({ mensagem: "Erro ao atualizar perfil." });
    }
  }
);

// PUT /api/admin/senha

interface CorpoSenha {
  senhaAtual?: string;
  novaSenha?: string;
}

router.put(
  "/senha",
  autenticar,
  async (
    req: Request<unknown, unknown, CorpoSenha>,
    res: Response
  ): Promise<void> => {
    try {
      const { adminId } = req as Request & { adminId: number };
      const { senhaAtual, novaSenha } = req.body;

      if (!senhaAtual || !novaSenha) {
        res.status(400).json({
          mensagem: "Preencha senha atual e nova senha.",
        });
        return;
      }
      if (novaSenha.length < 8) {
        res.status(400).json({
          mensagem: "A nova senha deve ter pelo menos 8 caracteres.",
        });
        return;
      }
      if (senhaAtual === novaSenha) {
        res.status(400).json({
          mensagem: "A nova senha deve ser diferente da atual.",
        });
        return;
      }

      const admin = await Administrador.findByPk(adminId);
      if (!admin) {
        res.status(404).json({ mensagem: "Administrador não encontrado." });
        return;
      }

      const ok = await bcrypt.compare(senhaAtual, admin.senhaHash);
      if (!ok) {
        res.status(401).json({ mensagem: "Senha atual incorreta." });
        return;
      }

      admin.senhaHash = await bcrypt.hash(novaSenha, 10);
      await admin.save();

      res.json({ mensagem: "Senha alterada com sucesso." });
    } catch (erro: unknown) {
      console.error("Erro ao alterar senha:", erro);
      res.status(500).json({ mensagem: "Erro ao alterar senha." });
    }
  }
);

export default router;