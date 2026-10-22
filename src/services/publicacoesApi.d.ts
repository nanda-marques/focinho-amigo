
export interface Publicacao {
  id: string | number;
  titulo: string;
  categoria: string;
  dataPublicacao: string;
  imagem: string;
  descricao: string;
  conteudo: string;
  status: string;
  destaque: boolean;
  urgente: boolean;
  autor: string;
}

export type PublicacaoEntrada = Omit<Publicacao, "id"> & {
  id?: string | number;
};

export const publicacoesApi: {
  listarAdmin(): Promise<Publicacao[]>;
  listarPublicadas(): Promise<Publicacao[]>;
  buscar(id: string | number): Promise<Publicacao | null>;
  salvar(publicacao: PublicacaoEntrada): Promise<Publicacao | null>;
  excluir(id: Publicacao["id"]): Promise<unknown>;
  [outraFuncao: string]: (...args: any[]) => Promise<any>;
};
