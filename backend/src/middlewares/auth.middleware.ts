import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { PayloadToken } from "../types/auth.types.js";

// augmenta Request para o TS reconhecer req.usuario
declare global {
  namespace Express {
    interface Request {
      usuario?: PayloadToken;
    }
  }
}

function obterJwtSecret(): string {
  const segredo = process.env.JWT_SECRET;
  if (!segredo) throw new Error("JWT_SECRET não definido no .env.");
  return segredo;
}

export function autenticar(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ mensagem: "Token não fornecido." });
    return;
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, obterJwtSecret()) as PayloadToken;
    req.usuario = payload;
    next();
  } catch {
    res.status(401).json({ mensagem: "Token inválido ou expirado." });
    return;
  }
}

/** Opcional: middleware de permissão por recurso. */
export function exigirPermissao(recurso: keyof import("../types/auth.types.js").Permissoes) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // assumindo que você carrega permissões em outro middleware ou consulta o Cargo
    const permissoes = (req as any).permissoes as Record<string, boolean> | undefined;
    if (!permissoes?.[recurso]) {
      res.status(403).json({ mensagem: "Sem permissão para este recurso." });
      return;
    }
    next();
  };
}

export { obterJwtSecret };