import { Router } from "express";
import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";

import type {
  Publicacao,
  PublicacaoInput,
  StatusPublicacao,
} from "../types/publicacao.js";

const router = Router();
const publicacoes: Publicacao[] = [];

const STATUS_VALIDOS: StatusPublicacao[] = [
  "rascunho",
  "publicado",
  "arquivado",
  "agendado",
];

function validar(dados: Partial<PublicacaoInput>): string | null {
  if (!dados.titulo?.trim()) return "O título é obrigatório.";
  if (!dados.categoria) return "A categoria é obrigatória.";
  if (
    dados.status &&
    !STATUS_VALIDOS.includes(dados.status)
  ) {
    return "Status inválido.";
  }
  if (
    typeof dados.imagem === "string" &&
    dados.imagem.length > 7_000_000
  ) {
    return "Imagem muito grande. Use um arquivo menor que 5 MB.";
  }
  return null;
}

function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function ajustarStatusAgendamento(
  dataPublicacao: string | undefined,
  status: StatusPublicacao
): StatusPublicacao {
  if (dataPublicacao && dataPublicacao > hojeISO() && status === "publicado") {
    return "agendado";
  }
  return status;
}

// ROTA PÚBLICA
router.get("/", (_req: Request, res: Response): void => {
  const publicadas = publicacoes
    .filter((p) => p.status === "publicado")
    .sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
  res.json(publicadas);
});

// ROTA ADMIN
router.get("/admin", (_req: Request, res: Response): void => {
  const ordenadas = [...publicacoes].sort((a, b) =>
    b.atualizadoEm.localeCompare(a.atualizadoEm)
  );
  res.json(ordenadas);
});

// BUSCAR POR ID
router.get("/:id", (req: Request, res: Response): void => {
  const publicacao = publicacoes.find((p) => p.id === req.params.id);
  if (!publicacao) {
    res.status(404).json({ erro: "Publicação não encontrada." });
    return;
  }
  res.json(publicacao);
});

// CRIAR
router.post("/", (req: Request, res: Response): void => {
  const erro = validar(req.body);
  if (erro) {
    res.status(400).json({ erro });
    return;
  }

  const agora = new Date().toISOString();
  const statusFinal = ajustarStatusAgendamento(
    req.body.dataPublicacao,
    req.body.status ?? "rascunho"
  );

  const publicacao: Publicacao = {
    ...req.body,
    id: randomUUID(),
    status: statusFinal,
    criadoEm: agora,
    atualizadoEm: agora,
  };

  publicacoes.unshift(publicacao);
  res.status(201).json(publicacao);
});

// ATUALIZAR
router.put("/:id", (req: Request, res: Response): void => {
  const indice = publicacoes.findIndex((p) => p.id === req.params.id);
  if (indice < 0) {
    res.status(404).json({ erro: "Publicação não encontrada." });
    return;
  }

  const erro = validar(req.body);
  if (erro) {
    res.status(400).json({ erro });
    return;
  }

  const statusFinal = ajustarStatusAgendamento(
    req.body.dataPublicacao,
    req.body.status ?? publicacoes[indice].status
  );

  publicacoes[indice] = {
    ...publicacoes[indice],
    ...req.body,
    id: req.params.id, // preserva o ID — IMPORTANTE
    status: statusFinal,
    atualizadoEm: new Date().toISOString(),
  };

  res.json(publicacoes[indice]);
});

// EXCLUIR
router.delete("/:id", (req: Request, res: Response): void => {
  const indice = publicacoes.findIndex((p) => p.id === req.params.id);
  if (indice < 0) {
    res.status(404).json({ erro: "Publicação não encontrada." });
    return;
  }
  publicacoes.splice(indice, 1);
  res.status(204).end();
});

export default router;