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

router.post("/", (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  
  const agora = new Date().toISOString();
  let statusFinal = req.body.status || "rascunho";

  // Se a data de publicação for futura e o usuário tentou publicar, define como agendado
  if (req.body.dataPublicacao && new Date(req.body.dataPublicacao) > new Date() && statusFinal === "publicado") {
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

router.get("/", (_req, res) => {
  res.json(publicacoes.filter((p) => p.status === "publicado").sort((a, b) => (b.atualizadoEm || "").localeCompare(a.atualizadoEm || "")));
});

router.get("/admin", (_req, res) => {
  res.json([...publicacoes].sort((a, b) => (b.atualizadoEm || "").localeCompare(a.atualizadoEm || "")));
});

router.get("/:id", (req, res) => {
  const publicacao = publicacoes.find((p) => p.id === req.params.id);
  if (!publicacao) return res.status(404).json({ erro: "Publicação não encontrada." });
  res.json(publicacao);
});

router.post("/", (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  const agora = new Date().toISOString();
  const publicacao = {
    ...req.body, id: randomUUID(), status: req.body.status || "rascunho",
    criadoEm: agora, atualizadoEm: agora,
  };
  publicacoes.unshift(publicacao);
  res.status(201).json(publicacao);
});

router.put("/:id", (req, res) => {
  const indice = publicacoes.findIndex((p) => p.id === req.params.id);
  if (indice < 0) return res.status(404).json({ erro: "Publicação não encontrada." });
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  publicacoes[indice] = { ...publicacoes[indice], ...req.body, id: req.params.id, atualizadoEm: new Date().toISOString() };
  res.json(publicacoes[indice]);
});

router.delete("/:id", (req, res) => {
  const indice = publicacoes.findIndex((p) => p.id === req.params.id);
  if (indice < 0) return res.status(404).json({ erro: "Publicação não encontrada." });
  publicacoes.splice(indice, 1);
  res.status(204).end();
});

export default router;