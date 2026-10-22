const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Tipos

export type StatusPublicacao =
  | "publicado"
  | "agendado"
  | "rascunho"
  | "arquivado";

export interface Publicacao {
  id: string;                    
  titulo: string;
  categoria?: string;
  status?: "publicado" | "agendado" | "rascunho" | "arquivado";
  dataPublicacao?: string;
  conteudo?: string;
  descricao?: string;
  imagem?: string;
  resumo?: string;
  autor?: string;
  destaque?: boolean;
  urgente?: boolean;
  criadoEm?: string;             // ← backend manda "criadoEm", não "createdAt"
  atualizadoEm?: string;
}

export type PublicacaoPayload = Omit<
  Publicacao,
  "id" | "criadoEm" | "atualizadoEm"
> & {
  id?: string;
};

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

  // Content-Type só quando há body e ele não é FormData.
  const headers: Record<string, string> = {
    ...(opcoes.body && !(opcoes.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
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
    return undefined as T;
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

/* ------------------------------ API ------------------------------ */

export const publicacoesApi = {
  listarAdmin: (): Promise<Publicacao[]> =>
    requisicao<Publicacao[]>("/api/publicacoes/admin"),

  listarPublicadas: (): Promise<Publicacao[]> =>
    requisicao<Publicacao[]>("/api/publicacoes"),

  buscar: (id: number | string): Promise<Publicacao> => {
    if (id === undefined || id === null || id === "") {
      return Promise.reject(new Error("ID da publicação não informado."));
    }
    return requisicao<Publicacao>(`/api/publicacoes/${id}`);
  },

  salvar: (dados: PublicacaoPayload): Promise<Publicacao> =>
    requisicao<Publicacao>(
      dados.id != null
        ? `/api/publicacoes/${dados.id}`
        : "/api/publicacoes",
      {
        method: dados.id != null ? "PUT" : "POST",
        body: JSON.stringify(dados),
      }
    ),

  excluir: (id: number | string): Promise<void> =>
    requisicao<void>(`/api/publicacoes/${id}`, { method: "DELETE" }),
};