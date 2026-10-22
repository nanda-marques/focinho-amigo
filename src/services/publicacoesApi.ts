const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";


export type StatusPublicacao = "publicado" | "agendado" | "rascunho";

export interface Publicacao {
  id: number;
  titulo: string;
  categoria?: string;
  status?: StatusPublicacao;
  dataPublicacao?: string;
  data?: string;
  createdAt?: string;
  conteudo?: string;
  imagem?: string;
  resumo?: string;
}

/** Payload aceito ao criar/editar (id opcional — presente = PUT). */
export interface PublicacaoPayload {
  id?: number;
  titulo: string;
  categoria?: string;
  status?: StatusPublicacao;
  dataPublicacao?: string;
  data?: string;
  conteudo?: string;
  imagem?: string;
  resumo?: string;
}

interface ErroApi {
  erro?: string;
  message?: string;
}

type OpcoesRequisicao = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

/* ------------------------------ Request ------------------------------ */

async function requisicao<T>(
  caminho: string,
  opcoes: OpcoesRequisicao = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    // Só define Content-Type quando NÃO for FormData
    ...(opcoes.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opcoes.headers,
  };

  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers,
  });

  // 204 / 205 não têm corpo
  if (resposta.status === 204 || resposta.status === 205) {
    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status} em ${caminho}`);
    }
    return null as T;
  }

  const texto = await resposta.text();
  let dados: unknown = null;

  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = texto; // backend devolveu HTML/texto puro
    }
  }

  if (!resposta.ok) {
    const erro = dados as ErroApi | string | null;
    const mensagem =
      typeof erro === "string"
        ? erro
        : erro?.erro ?? erro?.message ?? `Erro ${resposta.status}`;
    throw new Error(mensagem);
  }

  return dados as T;
}

// API

export const publicacoesApi = {
  listarAdmin: (): Promise<Publicacao[]> =>
    requisicao<Publicacao[]>("/api/publicacoes/admin"),

  listarPublicadas: (): Promise<Publicacao[]> =>
    requisicao<Publicacao[]>("/api/publicacoes"),

  buscar: (id: number | string): Promise<Publicacao> =>
    requisicao<Publicacao>(`/api/publicacoes/${id}`),

  salvar: (dados: PublicacaoPayload): Promise<Publicacao> =>
    requisicao<Publicacao>(
      dados.id ? `/api/publicacoes/${dados.id}` : "/api/publicacoes",
      {
        method: dados.id ? "PUT" : "POST",
        body: JSON.stringify(dados),
      }
    ),

  excluir: (id: number | string): Promise<void> =>
    requisicao<void>(`/api/publicacoes/${id}`, { method: "DELETE" }),
};