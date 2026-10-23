const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Tipos 

export interface Permissoes {
  animais: boolean;
  conteudo: boolean;
  newsletter: boolean;
  admins: boolean;
}

export interface UsuarioLogado {
  id: number;
  nomeCompleto: string;
  email: string;
  cargo: string | null;
  permissoes: Permissoes | null;
}

export interface RespostaLogin {
  mensagem: string;
  token: string;
  usuario: UsuarioLogado;
}

export interface RespostaCadastro {
  mensagem: string;
  usuario: {
    id: number;
    nomeCompleto: string;
    email: string;
    cargo: string;
  };
}

export interface DadosCadastro {
  nome: string;
  sobrenome: string;
  email: string;
  cargo: string;
  senha: string;
}

interface ErroApi {
  mensagem?: string;
  erro?: string;
}

type OpcoesRequisicao = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

// Request

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
    const msg =
      typeof erro === "string"
        ? erro
        : erro?.mensagem ?? erro?.erro ?? `Erro ${resposta.status}`;
    throw new Error(msg);
  }

  return dados as T;
}

// API

export const authApi = {
  cadastrar: (dados: DadosCadastro): Promise<RespostaCadastro> =>
    requisicao<RespostaCadastro>("/api/auth/cadastro", {
      method: "POST",
      body: JSON.stringify(dados),
    }),

  login: (email: string, senha: string): Promise<RespostaLogin> =>
    requisicao<RespostaLogin>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    }),

  salvarSessao(resposta: RespostaLogin): void {
    localStorage.setItem("token", resposta.token);
    localStorage.setItem("usuario", JSON.stringify(resposta.usuario));
  },

  limparSessao(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  },

  usuarioAtual(): UsuarioLogado | null {
    const bruto = localStorage.getItem("usuario");
    if (!bruto) return null;
    try {
      return JSON.parse(bruto) as UsuarioLogado;
    } catch {
      return null;
    }
  },

  estaLogado(): boolean {
    return Boolean(localStorage.getItem("token"));
  },

  /** Atalhos para checar permissão sem ler o objeto inteiro. */
  podeGerenciar(recurso: keyof Permissoes): boolean {
    const u = authApi.usuarioAtual();
    return Boolean(u?.permissoes?.[recurso]);
  },
};