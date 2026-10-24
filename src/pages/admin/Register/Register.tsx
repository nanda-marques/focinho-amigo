import { useEffect, useState } from "react";
import type {
  ChangeEvent,
  ComponentType,
  FormEvent,
  JSX,
  ReactNode,
} from "react";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiHeart,
  FiCamera,
  FiChevronDown,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { authApi } from "../../../services/authApi";

import logo from "../../../assets/logo_pequena.svg";

const CARGOS = [
  "Coordenador de Adoções",
  "Coordenador de Voluntários",
  "Comunicação e Marketing",
  "Financeiro",
];

type NivelForca = 0 | 1 | 2 | 3;

const FORCA: Record<
  NivelForca,
  { txt: string; barra: string; cor: string } | null
> = {
  0: null,
  1: {
    txt: "Fraca • Mínimo 8 caracteres e caracteres especiais",
    barra: "bg-red-500",
    cor: "text-red-500",
  },
  2: { txt: "Senha média", barra: "bg-amber-500", cor: "text-amber-600" },
  3: { txt: "Senha forte", barra: "bg-emerald-500", cor: "text-emerald-500" },
};

function nivelSenha(s: string): NivelForca {
  if (!s) return 0;
  const pontos = [
    s.length >= 8,
    /[A-Z]/.test(s) && /\d/.test(s),
    /[^A-Za-z0-9]/.test(s),
  ].filter(Boolean).length;
  return Math.min(3, Math.max(1, pontos)) as NivelForca;
}

interface CampoProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  erro?: string;
  icone?: ComponentType<{ className?: string }>;
  direita?: ReactNode;
}

function Campo({
  label,
  erro,
  icone: Icone,
  direita,
  ...input
}: CampoProps): JSX.Element {
  return (
    <label className="block">
      <span className="block mb-1.5 text-[12.5px] font-bold">{label}</span>
      <div
        className={`h-10 flex items-center gap-2.5 px-3 bg-[#f7f9fb] border rounded-lg focus-within:ring-4 ${
          erro
            ? "border-red-500 text-red-500 focus-within:ring-red-500/10"
            : "border-[#dce5ef] text-[#687d9a] focus-within:border-[#2174b7] focus-within:ring-[#2174b7]/10"
        }`}
      >
        {Icone && <Icone className="w-[17px] h-[17px] shrink-0" />}
        <input
          {...input}
          className="w-full min-w-0 text-[13px] text-[#273449] bg-transparent outline-none placeholder:text-[#8a9bb3]"
        />
        {direita}
      </div>
      {erro && <p className="mt-1 text-[11px] text-red-500">{erro}</p>}
    </label>
  );
}

function Secao({ children }: { children: ReactNode }): JSX.Element {
  return (
    <h3 className="mt-5 mb-2.5 text-[11.5px] font-extrabold uppercase text-[#2174b7]">
      {children}
    </h3>
  );
}

type Formulario = {
  nome: string;
  sobrenome: string;
  email: string;
  cargo: string;
  senha: string;
  confirmar: string;
};

type Erros = Partial<Record<keyof Formulario | "foto" | "geral", string>>;

/** Página de cadastro administrativo. */
export default function Cadastro(): JSX.Element {
  const [f, setF] = useState<Formulario>({
    nome: "",
    sobrenome: "",
    email: "",
    cargo: CARGOS[0],
    senha: "",
    confirmar: "",
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [ver, setVer] = useState(false);
  const [erros, setErros] = useState<Erros>({});
  const [sucesso, setSucesso] = useState(false);

  const nivel = nivelSenha(f.senha);
  const temErro = Object.values(erros).some(Boolean);

  useEffect(() => {
    if (!foto) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(foto);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [foto]);

  const set =
    (campo: keyof Formulario) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = e.target;
      setF((prev) => ({ ...prev, [campo]: value }));
      setErros((prev) => {
        const { [campo]: _omit, ...rest } = prev;
        return rest;
      });
    };

  function escolherFoto(e: ChangeEvent<HTMLInputElement>) {
    const arq = e.target.files?.[0];
    if (!arq) return;
    const ok =
      ["image/png", "image/jpeg"].includes(arq.type) &&
      arq.size <= 2 * 1024 * 1024;
    setFoto(ok ? arq : null);
    setErros((prev) => {
      const { foto: _omit, ...rest } = prev;
      return ok ? rest : { ...rest, foto: "Use PNG, JPG ou JPEG de até 2MB" };
    });
  }

  async function enviar(e: FormEvent) {
  e.preventDefault();
  const x: Erros = {};

  (["nome", "sobrenome", "email", "senha", "confirmar"] as const).forEach(
    (c) => {
      if (!f[c].trim()) x[c] = "Campo obrigatório";
    }
  );
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    x.email = "E-mail inválido";
  }
  if (f.senha && nivel < 2) x.senha = "Senha muito fraca";
  if (f.confirmar && f.senha !== f.confirmar) {
    x.confirmar = "As senhas não coincidem";
  }
  if (erros.foto) x.foto = erros.foto;

  setErros(x);
  if (Object.keys(x).length) return;

  try {
    await authApi.cadastrar({
      nome: f.nome,
      sobrenome: f.sobrenome,
      email: f.email,
      cargo: f.cargo,
      senha: f.senha,
      foto,
    });
    setSucesso(true);
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Erro ao criar conta";
    setErros(
      msg.toLowerCase().includes("e-mail")
        ? { email: msg }
        : { geral: msg }
    );
    }
  }

  const olho = (
    <button
      type="button"
      onClick={() => setVer((v) => !v)}
      aria-label={ver ? "Ocultar senha" : "Mostrar senha"}
      className="shrink-0 text-[#687d9a] hover:text-[#2174b7]"
    >
      {ver ? (
        <FiEyeOff className="w-[17px] h-[17px]" />
      ) : (
        <FiEye className="w-[17px] h-[17px]" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[38.9%_61.1%] font-['Inter',Arial,sans-serif] text-[#202b3e] bg-[#f0f0f0]">
      <aside className="lg:min-h-screen flex flex-col justify-between gap-8 p-6 sm:p-9 lg:px-16 lg:py-10 text-white bg-[#2174b7]">
        <a
          href="/"
          className="flex items-center gap-3 w-fit lg:ml-2.5 text-white no-underline"
          aria-label="Focinho Amigo"
        >
          <img
            src={logo}
            alt="Focinho Amigo"
            className="w-[54px] h-[49px] object-contain"
          />
          <span className="flex flex-col gap-0.5">
            <strong className="text-[15px] font-extrabold">Focinho Amigo</strong>
            <small className="text-[11px] font-semibold text-[#ffd21f]">
              Painel Admin
            </small>
          </span>
        </a>
        <section className="max-w-[405px] lg:my-auto">
          <h1 className="mb-4 text-[28px] sm:text-[32px] lg:text-[clamp(30px,2.5vw,36px)] leading-[1.2] tracking-[-1px] font-extrabold">
            Nos ajude a salvar
            <br />
            vidas.
          </h1>
          <p className="text-[14px] lg:text-[15.5px] leading-normal text-[#e1edf9]">
            Faça parte da nossa rede administrativa e ajude a coordenar
            campanhas, gerenciar adoções, voluntários e divulgar conquistas de
            nossa ONG.
          </p>
        </section>
        <footer className="flex items-center gap-3 text-[12.5px] text-[#b7d7f3]">
          <FiHeart className="w-[19px] h-[19px] shrink-0" /> Focinho Amigo ONG •
          Proteção Animal
        </footer>
      </aside>

      <section className="flex items-center justify-center p-5 lg:p-10">
        {sucesso ? (
          <div className="w-full max-w-[480px] p-10 text-center bg-white border border-[#e2e2e2] rounded-2xl shadow">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
              <FiCheck className="w-9 h-9" />
            </div>
            <h2 className="mb-3 text-2xl font-extrabold">
              Conta criada com sucesso!
            </h2>
            <p className="mb-7 text-[13.5px] text-[#667b9b]">
              Sua conta de administrador foi criada. Você já pode acessar o
              painel administrativo usando suas novas credenciais.
            </p>
            <a
              href="/admin/login"
              className="block leading-[42px] text-[13px] font-bold text-white no-underline bg-[#2174b7] rounded-lg hover:bg-[#1767a8]"
            >
              Ir para o Login
            </a>
          </div>
        ) : (
          <form
            onSubmit={enviar}
            noValidate
            className="w-full max-w-[520px] p-8 sm:px-10 bg-white border border-[#e2e2e2] rounded-2xl shadow"
          >
            <h2 className="text-2xl font-extrabold tracking-tight">
              Criar conta de administrador
            </h2>
            {temErro ? (
              <div
                role="alert"
                className="flex items-center gap-2.5 mt-5 p-3 text-[13px] text-red-500 bg-red-100 border border-red-500 rounded-md"
              >
                <FiAlertCircle className="w-[18px] h-[18px] shrink-0" />
                {erros.geral ||
                  "Corrija os erros destacados no formulário antes de prosseguir."}
              </div>
            ) : (
              <p className="mt-2 text-[13px] text-[#667b9b]">
                Preencha os dados abaixo para solicitar credenciais de acesso
              </p>
            )}

            <Secao>1. Informações pessoais</Secao>
            <div className="grid sm:grid-cols-2 gap-4">
              <Campo
                label="Nome"
                placeholder="Ex.: Mariana"
                value={f.nome}
                onChange={set("nome")}
                erro={erros.nome}
              />
              <Campo
                label="Sobrenome"
                placeholder="Ex.: Silva"
                value={f.sobrenome}
                onChange={set("sobrenome")}
                erro={erros.sobrenome}
              />
            </div>
            <div className="mt-3.5">
              <Campo
                label="E-mail corporativo / pessoal"
                icone={FiMail}
                type="email"
                placeholder="mariana.silva@focinhoamigo.org"
                value={f.email}
                onChange={set("email")}
                erro={erros.email}
              />
            </div>

            <Secao>2. Perfil &amp; atuação</Secao>
            <label className="block">
              <span className="block mb-1.5 text-[12.5px] font-bold">
                Cargo / Função na ONG
              </span>
              <div className="relative">
                <select
                  value={f.cargo}
                  onChange={set("cargo")}
                  className="w-full h-10 px-3 text-[13px] bg-[#f7f9fb] border border-[#dce5ef] rounded-lg appearance-none outline-none focus:border-[#2174b7]"
                >
                  {CARGOS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none" />
              </div>
            </label>

            <span className="block mt-3.5 mb-1.5 text-[12.5px] font-bold">
              Foto de Perfil
            </span>
            <label
              className={`relative flex flex-col items-center gap-1.5 p-5 text-center bg-[#f7f9fb] border border-dashed rounded-lg cursor-pointer ${
                erros.foto ? "border-red-500" : "border-[#dce5ef]"
              }`}
            >
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={escolherFoto}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Pré-visualização da foto de perfil"
                  className="w-14 h-14 object-cover rounded-full border border-[#dce5ef]"
                />
              ) : (
                <FiCamera className="w-5 h-5 text-[#687d9a]" />
              )}
              <span className="text-[12.5px] font-semibold text-[#0874ca]">
                {foto ? foto.name : "Arraste ou clique para enviar"}
              </span>
              <small className="text-[11px] text-[#687d9a]">
                Suporta PNG, JPG ou JPEG de até 2MB
              </small>
            </label>
            {erros.foto && (
              <p className="mt-1 text-[11px] text-red-500">{erros.foto}</p>
            )}

            <Secao>3. Segurança</Secao>
            <Campo
              label="Senha de Acesso"
              icone={FiLock}
              type={ver ? "text" : "password"}
              placeholder="Crie uma senha forte"
              value={f.senha}
              onChange={set("senha")}
              erro={erros.senha}
              direita={olho}
            />
            {nivel > 0 && FORCA[nivel] && (
              <>
                <div className="grid grid-cols-3 gap-2 mt-2.5">
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className={`h-[3px] rounded-full ${
                        nivel >= n ? FORCA[nivel]!.barra : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className={`mt-1 text-[11px] font-medium ${FORCA[nivel]!.cor}`}>
                  {FORCA[nivel]!.txt}
                </p>
              </>
            )}
            <div className="mt-3">
              <Campo
                label="Confirmar Nova Senha"
                icone={FiLock}
                type={ver ? "text" : "password"}
                placeholder="Repita a senha"
                value={f.confirmar}
                onChange={set("confirmar")}
                erro={erros.confirmar}
              />
            </div>

            <button
              type="submit"
              className="w-full h-[41px] mt-6 text-[13.5px] font-bold bg-[#ffb800] rounded-lg cursor-pointer hover:bg-[#f0ac00]"
            >
              Criar Conta de Administrador
            </button>
            <p className="mt-4 text-center text-[12.5px] text-[#687d9a]">
              Já possui uma conta?{" "}
              <a
                href="/admin/login"
                className="font-bold text-[#0874ca] no-underline hover:underline"
              >
                Entrar
              </a>
            </p>
          </form>
        )}
      </section>
    </div>
  );
}