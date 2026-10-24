const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

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
  /** Foto opcional — se informada, o cadastro vai como multipart/form-data. */
  foto?: File | null;
}

/** Erro tipado — guarda status HTTP para o componente decidir a UI. */
export class ErroApi extends Error {
  constructor(public status: number, mensagem: string) {
    super(mensagem);
    this.name = "ErroApi";
  }
}

interface ErroBruto {
  mensagem?: string;
  erro?: string;
}

type OpcoesRequisicao = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

// ===== Requisição genérica =====

async function requisicao<T>(
  caminho: string,
  opcoes: OpcoesRequisicao = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    // Só define Content-Type se não for FormData (multipart precisa que o browser defina o boundary)
    ...(opcoes.body && !(opcoes.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opcoes.headers,
  };

  const resposta = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers });

  if (resposta.status === 204 || resposta.status === 205) {
    if (!resposta.ok) throw new ErroApi(resposta.status, `Erro ${resposta.status}`);
    return undefined as T;
  }

  const texto = await resposta.text();
  let dados: unknown = null;
  if (texto) {
    try { dados = JSON.parse(texto); } catch { dados = texto; }
  }

  if (!resposta.ok) {
    const erro = dados as ErroBruto | string | null;
    const msg =
      typeof erro === "string"
        ? erro
        : erro?.mensagem ?? erro?.erro ?? `Erro ${resposta.status}`;
    throw new ErroApi(resposta.status, msg);
  }

  return dados as T;
}

// ===== API =====

export const authApi = {
  cadastrar(dados: DadosCadastro): Promise<RespostaCadastro> {
    // Se tem foto → multipart/form-data; senão, JSON (compatível com o backend antigo)
    if (dados.foto) {
      const form = new FormData();
      form.append("nome", dados.nome);
      form.append("sobrenome", dados.sobrenome);
      form.append("email", dados.email);
      form.append("cargo", dados.cargo);
      form.append("senha", dados.senha);
      form.append("foto", dados.foto);

      return requisicao<RespostaCadastro>("/api/auth/cadastro", {
        method: "POST",
        body: form,
      });
    }

    return requisicao<RespostaCadastro>("/api/auth/cadastro", {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },

  login(email: string, senha: string): Promise<RespostaLogin> {
    return requisicao<RespostaLogin>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });
  },

  /** Revalida a sessão no backend (útil ao recarregar a página). */
  me(): Promise<{ usuario: UsuarioLogado }> {
    return requisicao<{ usuario: UsuarioLogado }>("/api/auth/me");
  },

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
    try { return JSON.parse(bruto) as UsuarioLogado; } catch { return null; }
  },

  estaLogado(): boolean {
    return Boolean(localStorage.getItem("token"));
  },

  podeGerenciar(recurso: keyof Permissoes): boolean {
    return Boolean(authApi.usuarioAtual()?.permissoes?.[recurso]);
  },
};