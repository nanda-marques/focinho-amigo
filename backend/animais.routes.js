import { Router } from "express";
import { randomUUID } from "node:crypto";

const router = Router();

const animais = [
  { id: "1", nome: "Bela", especie: "Cão", raca: "Vira-lata", statusCastracao: "Castrada", data: "12/03/2026" },
  { id: "2", nome: "Bento", especie: "Cão", raca: "Poodle", statusCastracao: "Agendada", data: "20/03/2026" },
  { id: "3", nome: "Mia", especie: "Gato", raca: "Siamesa", statusCastracao: "Castrada", data: "08/03/2026" },
  { id: "4", nome: "Nino", especie: "Cão", raca: "Boxer", statusCastracao: "Pendente", data: "01/03/2026" },
];

function validar(dados) {
  if (!dados?.nome?.trim()) return "O nome do animal é obrigatório.";
  return null;
}

router.get("/", (_req, res) => {
  res.json(animais);
});

router.get("/:id", (req, res) => {
  const animal = animais.find((a) => a.id === req.params.id);
  if (!animal) return res.status(404).json({ erro: "Animal não encontrado." });
  res.json(animal);
});

router.post("/", (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });

  const hoje = new Date().toLocaleDateString("pt-BR");

  const novoAnimal = {
    ...req.body,
    id: randomUUID(),
    statusCastracao: req.body.castracao || req.body.statusCastracao || "Pendente",
    data: req.body.data || hoje,
    criadoEm: new Date().toISOString(),
  };

  animais.unshift(novoAnimal);
  res.status(201).json(novoAnimal);
});

router.put("/:id", (req, res) => {
  const indice = animais.findIndex((a) => a.id === req.params.id);
  if (indice < 0) return res.status(404).json({ erro: "Animal não encontrado." });

  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });

  animais[indice] = {
    ...animais[indice],
    ...req.body,
    id: req.params.id,
    statusCastracao: req.body.castracao || req.body.statusCastracao || animais[indice].statusCastracao,
    atualizadoEm: new Date().toISOString(),
  };

  res.json(animais[indice]);
});

router.delete("/:id", (req, res) => {
  const indice = animais.findIndex((a) => a.id === req.params.id);
  if (indice < 0) return res.status(404).json({ erro: "Animal não encontrado." });

  animais.splice(indice, 1);
  res.status(204).end();
});

export default router;