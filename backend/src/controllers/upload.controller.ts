import { Request, Response } from "express";
import { supabase } from "../config/supabase.js";
import { Foto } from "../models/Foto.js";

import ImagemPerfil from "../models/ImagemPerfil.js";
import { HttpError } from "../middlewares/error.middleware.js";

function sanitize(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_");
}

export const uploadController = {
  async uploadFoto(req: Request, res: Response): Promise<any> {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: "Nenhum ficheiro enviado." });

      const bucket = (req.body.bucket as string) || process.env.SUPABASE_BUCKET!;
      const prefixo = (req.body.prefixo as string) || "uploads";
      const fileName = `${prefixo}/${Date.now()}_${sanitize(file.originalname)}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        return res.status(502).json({ error: `Supabase: ${error.message}` });
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      const novaFoto = await Foto.create({ url: data.publicUrl });

      return res.status(201).json({ message: "Upload OK", dados: novaFoto });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  },

  async signedUrl(req: Request, res: Response): Promise<any> {
    try {
      const path = req.query.path as string;
      const bucket = (req.query.bucket as string) || "container-perfis";
      if (!path) return res.status(400).json({ error: "path obrigatório" });

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60);

      if (error) return res.status(502).json({ error: error.message });
      return res.json({ url: data.signedUrl });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  },

  async uploadPerfil(req: Request, res: Response): Promise<void> {
  const u = req.usuario;
  if (!u) throw new HttpError(401, "Não autenticado.");
  if (!req.file) throw new HttpError(400, "Nenhum ficheiro enviado.");

  const fileName = `admins/${u.id}/${Date.now()}_${sanitize(
    req.file.originalname
  )}`;

  const { error } = await supabase.storage
    .from("container-perfis")
    .upload(fileName, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: true,
    });

    if (error) throw new HttpError(502, `Supabase: ${error.message}`);
    await ImagemPerfil.upsert({
      idAdministradores: u.id,
      url: fileName,
    });

    res.json({ mensagem: "Foto atualizada.", path: fileName });
  },
};