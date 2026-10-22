export type Porte = "Pequeno" | "Médio" | "Grande";
export type Sexo = "M" | "F";
export type Especie = "Cão" | "Gato";

export type StatusCastracao = "Castrada" | "Castrado" | "Agendada" | "Pendente";

export interface Animal {
  id: string;
  nome: string;
  especie?: Especie | string;
  raca?: string;
  idade?: string;
  anos?: number;
  porte?: Porte | string;
  peso?: string;
  sexo?: Sexo | string;
  castracao?: StatusCastracao | string;
  statusCastracao?: StatusCastracao | string;
  temperamento?: string;
  cor?: string;
  foto?: string;
  data?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

/** O que o cliente envia (sem campos gerados pelo servidor). */
export type AnimalInput = Omit<Animal, "id" | "criadoEm" | "atualizadoEm">;