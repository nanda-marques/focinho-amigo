import type { Request, Response, NextFunction } from "express";

export class HttpError extends Error {
  constructor(public status: number, mensagem: string) {
    super(mensagem);
  }
}

export function tratarErros(
  erro: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (erro instanceof HttpError) {
    res.status(erro.status).json({ mensagem: erro.message });
    return;
  }

  // erro do multer (ex: arquivo grande)
  if (typeof erro === "object" && erro && "code" in erro) {
    const codigo = (erro as any).code;
    if (codigo === "LIMIT_FILE_SIZE") {
      res.status(413).json({ mensagem: "Arquivo excede o limite de 5MB." });
      return;
    }
  }

  console.error("Erro não tratado:", erro);
  res.status(500).json({ mensagem: "Erro interno no servidor." });
}

/** Wrapper para não repetir try/catch em todo controller. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}