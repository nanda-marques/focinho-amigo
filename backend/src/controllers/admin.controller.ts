import type { Request, Response } from "express";
import bcrypt from "bcryptjs";

import Administrador from "../models/Administrador.js";
import Cargo from "../models/Cargo.js";
import { HttpError } from "../middlewares/error.middleware.js";
import { adminParaUsuario } from "../types/auth.types.js";

export const adminController = {
  // PUT /api/admin/me
  async atualizarPerfil(req: Request, res: Response): Promise<void> {
    const u = req.usuario;
    if (!u) throw new HttpError(401, "Não autenticado.");

    const { nomeCompleto, email } = req.body as {
      nomeCompleto?: string;
      email?: string;
    };

    const admin = await Administrador.findByPk(u.id);
    if (!admin) throw new HttpError(404, "Administrador não encontrado.");

    if (email && email !== admin.email) {
      const existe = await Administrador.findOne({ where: { email } });
      if (existe) throw new HttpError(409, "E-mail já cadastrado.");
    }

    if (nomeCompleto?.trim()) admin.nomeCompleto = nomeCompleto.trim();
    if (email?.trim()) admin.email = email.trim();
    await admin.save();

    const cargoRef = await Cargo.findByPk(admin.cargo);

    res.json({
      mensagem: "Perfil atualizado com sucesso.",
      usuario: adminParaUsuario(admin, cargoRef),
    });
  },

  // PUT /api/admin/senha
  async alterarSenha(req: Request, res: Response): Promise<void> {
    const u = req.usuario;
    if (!u) throw new HttpError(401, "Não autenticado.");

    const { senhaAtual, novaSenha } = req.body as {
      senhaAtual?: string;
      novaSenha?: string;
    };

    if (!senhaAtual || !novaSenha) {
      throw new HttpError(400, "Senha atual e nova senha são obrigatórias.");
    }
    if (novaSenha.length < 8) {
      throw new HttpError(400, "A nova senha deve ter pelo menos 8 caracteres.");
    }

    const admin = await Administrador.findByPk(u.id);
    if (!admin) throw new HttpError(404, "Administrador não encontrado.");

    const ok = await bcrypt.compare(senhaAtual, admin.senhaHash);
    if (!ok) throw new HttpError(401, "Senha atual incorreta.");

    admin.senhaHash = await bcrypt.hash(novaSenha, 10);
    await admin.save();

    res.json({ mensagem: "Senha alterada com sucesso." });
  },
};