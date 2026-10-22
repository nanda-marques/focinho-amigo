import { Router } from "express";
import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";

import type { Animal, AnimalInput } from "../types/animal.js";
                                                  
const router = Router();

const animais: Animal[] = [
  { id: "1", nome: "Bela", especie: "Cão", raca: "Vira-lata", statusCastracao: "Castrada", data: "12/03/2026" },
  { id: "2", nome: "Bento", especie: "Cão", raca: "Poodle", statusCastracao: "Agendada", data: "20/03/2026" },
  { id: "3", nome: "Mia", especie: "Gato", raca: "Siamesa", statusCastracao: "Castrada", data: "08/03/2026" },
  { id: "4", nome: "Nino", especie: "Cão", raca: "Boxer", statusCastracao: "Pendente", data: "01/03/2026" },
];

function validar(dados: Partial<AnimalInput>): string | null {
  if (!dados.nome?.trim()) return "O nome do animal é obrigatório.";
  return null;
}

// LISTAR
router.get("/", (_req: Request, res: Response): void => {
  res.json(animais);
});

// BUSCAR POR ID
router.get("/:id", (req: Request, res: Response): void => {
  const animal = animais.find((a) => a.id === req.params.id);
  if (!animal) {
    res.status(404).json({ erro: "Animal não encontrado." });
    return;
  }
  res.json(animal);
});

// CRIAR
router.post("/", (req: Request, res: Response): void => {
  const erro = validar(req.body);
  if (erro) {
    res.status(400).json({ erro });
    return;
  }

  const hoje = new Date().toLocaleDateString("pt-BR");

  const novoAnimal: Animal = {
    ...req.body,
    id: randomUUID(),
    statusCastracao:
      req.body.castracao || req.body.statusCastracao || "Pendente",
    data: req.body.data || hoje,
    criadoEm: new Date().toISOString(),
  };

  animais.unshift(novoAnimal);
  res.status(201).json(novoAnimal);
});

// ATUALIZAR
router.put("/:id", (req: Request, res: Response): void => {
  const indice = animais.findIndex((a) => a.id === req.params.id);
  if (indice < 0) {
    res.status(404).json({ erro: "Animal não encontrado." });
    return;
  }

  const erro = validar(req.body);
  if (erro) {
    res.status(400).json({ erro });
    return;
  }

  animais[indice] = {
    ...animais[indice],
    ...req.body,
    id: req.params.id, // preserva o ID
    statusCastracao:
      req.body.castracao ||
      req.body.statusCastracao ||
      animais[indice].statusCastracao,
    atualizadoEm: new Date().toISOString(),
  };

  res.json(animais[indice]);
});

// EXCLUIR
router.delete("/:id", (req: Request, res: Response): void => {
  const indice = animais.findIndex((a) => a.id === req.params.id);
  if (indice < 0) {
    res.status(404).json({ erro: "Animal não encontrado." });
    return;
  }

  animais.splice(indice, 1);
  res.status(204).end();
});

export default router;