const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Tipos

export type StatusCastracao =
  | "Pendente"
  | "Castrado"
  | "Castrada"
  | "Agendada";

export interface Animal {
  id: string;
  nome: string;
  especie?: string;
  raca?: string;
  idade?: string;
  anos?: number;
  porte?: string;
  peso?: string;
  castracao?: StatusCastracao | string;
  statusCastracao?: StatusCastracao | string;
  temperamento?: string;
  cor?: string;
  foto?: string;
  data?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export type NovoAnimal = Omit<Animal, "id" | "criadoEm" | "atualizadoEm">;

// Request

interface ErroApi {
  erro?: string;
  message?: string;
}

type OpcoesRequisicao = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

async function requisicao<T>(
  caminho: string,
  opcoes: OpcoesRequisicao = {}
): Promise<T> {
  const token = localStorage.getItem("token");

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

  // 204 / 205 não têm corpo — não tentar .json()
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
      dados = texto; 
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

export const animaisApi = {
  listar: (): Promise<Animal[]> =>
    requisicao<Animal[]>("/api/animais"),

  buscar: (id: string): Promise<Animal> => {
    if (!id || id === "NaN" || id === "undefined") {
      return Promise.reject(new Error("ID do animal inválido."));
    }
    return requisicao<Animal>(`/api/animais/${id}`);
  },

  criar: (dados: NovoAnimal): Promise<Animal> =>
    requisicao<Animal>("/api/animais", {
      method: "POST",
      body: JSON.stringify(dados),
    }),

  atualizar: (id: string, dados: NovoAnimal): Promise<Animal> =>
    requisicao<Animal>(`/api/animais/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    }),

  excluir: (id: string): Promise<void> => {
    if (!id || id === "NaN" || id === "undefined") {
      return Promise.reject(new Error("ID do animal inválido."));
    }
    return requisicao<void>(`/api/animais/${id}`, { method: "DELETE" });
  },

  importarCSV: (file: File): Promise<{ importados: number }> => {
    const fd = new FormData();
    fd.append("file", file);
    return requisicao<{ importados: number }>("/api/animais/importar-csv", {
      method: "POST",
      body: fd,
    });
  },
};