import { Router } from "express";
import { randomUUID } from "node:crypto";

const router = Router();

const publicacoes = [];

function validar(dados) {
  if (!dados?.titulo?.trim()) return "O título é obrigatório.";
  if (!dados?.categoria) return "A categoria é obrigatória.";
  if (!["rascunho", "publicado", "arquivado", "agendado"].includes(dados.status || "rascunho")) return "Status inválido.";
  if (dados.imagem && typeof dados.imagem === "string" && dados.imagem.length > 7_000_000) return "Imagem muito grande. Use um arquivo menor que 5 MB.";
  return null;
}

// ROTA PÚBLICA: Retorna APENAS as publicações com status "publicado"
router.get("/", (_req, res) => {
  const publicadas = publicacoes.filter((p) => p.status === "publicado");
  publicadas.sort((a, b) => (b.atualizadoEm || "").localeCompare(a.atualizadoEm || ""));

  res.json(publicadas);
});

// ROTA ADMIN: Retorna todas as publicações (publicadas, rascunhos, agendadas, etc)
router.get("/admin", (_req, res) => {
  res.json([...publicacoes].sort((a, b) => (b.atualizadoEm || "").localeCompare(a.atualizadoEm || "")));
});

// BUSCAR POR ID
router.get("/:id", (req, res) => {
  const publicacao = publicacoes.find((p) => p.id === req.params.id);
  if (!publicacao) return res.status(404).json({ erro: "Publicação não encontrada." });
  res.json(publicacao);
});

// CRIAR PUBLICAÇÃO
router.post("/", (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  
  const agora = new Date().toISOString();
  let statusFinal = req.body.status || "rascunho";

  // Compara apenas a parte da data (YYYY-MM-DD) para evitar problemas com horas
  const hojeStr = new Date().toISOString().slice(0, 10);
  if (req.body.dataPublicacao && req.body.dataPublicacao > hojeStr && statusFinal === "publicado") {
    statusFinal = "agendado";
  }

  const publicacao = {
    ...req.body, 
    id: randomUUID(), 
    status: statusFinal,
    criadoEm: agora, 
    atualizadoEm: agora,
  };
  publicacoes.unshift(publicacao);
  res.status(201).json(publicacao);
});

// ATUALIZAR PUBLICAÇÃO
router.put("/:id", (req, res) => {
  const indice = publicacoes.findIndex((p) => p.id === req.params.id);
  if (indice < 0) return res.status(404).json({ erro: "Publicação não encontrada." });

  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });

  let statusFinal = req.body.status || publicacoes[indice].status;

  const hojeStr = new Date().toISOString().slice(0, 10);
  if (req.body.dataPublicacao && req.body.dataPublicacao > hojeStr && statusFinal === "publicado") {
    statusFinal = "agendado";
  }

  publicacoes[indice] = { 
    ...publicacoes[indice], 
    ...req.body, 
    id: req.params.id, 
    status: statusFinal,
    atualizadoEm: new Date().toISOString() 
  };

  res.json(publicacoes[indice]);
});

// EXCLUIR PUBLICAÇÃO
router.delete("/:id", (req, res) => {
  const indice = publicacoes.findIndex((p) => p.id === req.params.id);
  if (indice < 0) return res.status(404).json({ erro: "Publicação não encontrada." });
  
  publicacoes.splice(indice, 1);
  res.status(204).end();
});

export default router;