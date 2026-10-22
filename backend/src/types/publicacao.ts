export type StatusPublicacao =
  | "rascunho"
  | "publicado"
  | "agendado"
  | "arquivado";

export interface Publicacao {
  id: string;
  titulo: string;
  categoria: string;
  status: StatusPublicacao;
  dataPublicacao?: string;
  conteudo?: string;
  descricao?: string;
  imagem?: string;
  resumo?: string;
  autor?: string;
  destaque?: boolean;
  urgente?: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export type PublicacaoInput = Omit<
  Publicacao,
  "id" | "criadoEm" | "atualizadoEm" | "status"
> & {
  status?: StatusPublicacao;
};