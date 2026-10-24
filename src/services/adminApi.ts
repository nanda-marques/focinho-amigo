const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export interface PerfilAdmin {
  id: number;
  nomeCompleto: string;
  email: string;
  cargo: string | null;
  ativo: boolean;
  criadoEm: string;
  fotoPath: string | null;         
}

interface ErroApi {
  mensagem?: string;
  erro?: string;
}

async function requisicao<T>(
  caminho: string,
  opcoes: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const headers: Record<string, string> = {
    ...(opcoes.body && !(opcoes.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    Authorization: `Bearer ${token}`,
    ...(opcoes.headers as Record<string, string> | undefined),
  };

  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers,
  });

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
    const msg =
      typeof erro === "string"
        ? erro
        : erro?.mensagem ?? erro?.erro ?? `Erro ${resposta.status}`;
    throw new Error(msg);
  }

  return dados as T;
}

export const adminApi = {

  meuPerfil: (): Promise<PerfilAdmin> =>
    requisicao<PerfilAdmin>("/api/admin/me"),

  atualizarPerfil: (dados: {
    nomeCompleto?: string;
    email?: string;
  }): Promise<{ mensagem: string; usuario: Partial<PerfilAdmin> }> =>
    requisicao("/api/admin/me", {
      method: "PUT",
      body: JSON.stringify(dados),
    }),

  alterarSenha: (dados: {
    senhaAtual: string;
    novaSenha: string;
  }): Promise<{ mensagem: string }> =>
    requisicao("/api/admin/senha", {
      method: "PUT",
      body: JSON.stringify(dados),
    }),

  // POST /api/upload/perfil → multipart, autenticado
  atualizarFotoPerfil: (
    file: File
  ): Promise<{ mensagem: string; path: string }> => {
    const form = new FormData();
    form.append("foto", file);
    return requisicao<{ mensagem: string; path: string }>(
      "/api/upload/perfil",
      {
        method: "POST",
        body: form,
      }
    );
  },

  // GET /api/upload/foto-privada?path=...&bucket=container-perfis
  urlFotoPerfil: (
    path: string | null | undefined
  ): Promise<string | null> => {
    if (!path) return Promise.resolve(null);
    return requisicao<{ url: string }>(
      `/api/upload/foto-privada?path=${encodeURIComponent(
        path
      )}&bucket=container-perfis`
    ).then((r) => r.url);
  },
};