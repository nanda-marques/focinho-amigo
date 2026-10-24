import type { Cargo } from "../models/Cargo.js";
import type Administrador from "../models/Administrador.js";

export interface CorpoCadastro {
  nome?: string;
  sobrenome?: string;
  email?: string;
  cargo?: string;
  senha?: string;
}

export interface CorpoLogin {
  email?: string;
  senha?: string;
}

export interface PayloadToken {
  id: number;
  email: string;
  cargo: string;
}

export interface Permissoes {
  animais: boolean;
  conteudo: boolean;
  newsletter: boolean;
  admins: boolean;
}

export interface UsuarioPublico {
  id: number;
  nomeCompleto: string;
  email: string;
  cargo: string | null;
  permissoes?: Permissoes | null;
}

/** Converte Cargo (modelo) → objeto de permissões. */
export function permissoesDe(cargo: Cargo | undefined | null): Permissoes | null {
  if (!cargo) return null;
  return {
    animais: Boolean(cargo.podeGerenciarAnimais),
    conteudo: Boolean(cargo.podeGerenciarConteudo),
    newsletter: Boolean(cargo.podeGerenciarNewsletter),
    admins: Boolean(cargo.podeGerenciarAdmins),
  };
}

/** Serializa admin para resposta pública (nunca expõe senhaHash). */
export function adminParaUsuario(
  admin: Administrador,
  cargoRef?: Cargo | null
): UsuarioPublico {
  return {
    id: admin.id,
    nomeCompleto: admin.nomeCompleto,
    email: admin.email,
    cargo: cargoRef?.nomeCargo ?? null,
  };
}