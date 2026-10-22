export type TipoHistorico =
  | "vacinacao"
  | "vermifugacao"
  | "castracao"
  | "microchip";

export interface ItemHistorico {
  tipo: TipoHistorico;
  titulo: string;
  texto: string;
}

export interface DetalhesPet {
  fotos: string[];
  idadeEstimada?: string;
  peso?: string;
  castrado?: string;
  cor?: string;
  temperamento?: string;
  sobre?: string;
  historico?: ItemHistorico[];
}

export interface Pet {
  id: number;
  nome: string;
  tipo: "Cão" | "Gato";
  imagem: string;            
  raca?: string;
  idade?: string;
  anos?: number;
  porte?: "Pequeno" | "Médio" | "Grande";
  sexo?: "M" | "F";
  tags?: string[];
  descricao?: string;
  disponivelAdocao?: boolean;
  detalhes?: DetalhesPet;
}