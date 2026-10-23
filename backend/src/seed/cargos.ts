import Cargo from "../models/Cargo.js";

const CARGOS_INICIAIS = [
  {
    nomeCargo: "Administrador",
    podeGerenciarAnimais: true,
    podeGerenciarConteudo: true,
    podeGerenciarNewsletter: true,
    podeGerenciarAdmins: true,
  },
  {
    nomeCargo: "Coordenador de Adoções",
    podeGerenciarAnimais: true,
    podeGerenciarConteudo: false,
    podeGerenciarNewsletter: false,
    podeGerenciarAdmins: false,
  },
  {
    nomeCargo: "Comunicação e Marketing",
    podeGerenciarAnimais: false,
    podeGerenciarConteudo: true,
    podeGerenciarNewsletter: true,
    podeGerenciarAdmins: false,
  },
  {
    nomeCargo: "Coordenador de Voluntários",
    podeGerenciarAnimais: true,
    podeGerenciarConteudo: false,
    podeGerenciarNewsletter: false,
    podeGerenciarAdmins: false,
  },
  {
    nomeCargo: "Financeiro",
    podeGerenciarAnimais: false,
    podeGerenciarConteudo: false,
    podeGerenciarNewsletter: false,
    podeGerenciarAdmins: false,
  },
] as const;

export async function seedCargos(): Promise<void> {
  const existentes = await Cargo.count();
  if (existentes > 0) return;
  await Cargo.bulkCreate(CARGOS_INICIAIS.map((c) => ({ ...c })));
  console.log("Cargos iniciais criados.");
}