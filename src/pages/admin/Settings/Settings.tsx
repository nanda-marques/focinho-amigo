import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  LuUser,
  LuShield,
  LuUpload,
  LuEye,
  LuEyeOff,
  LuLock,
} from "react-icons/lu";

import AdminHeader from "../../../components/layout/adminHeader";

type TipoMensagem = "erro" | "sucesso" | "";

interface Mensagem {
  tipo: TipoMensagem;
  texto: string;
}

interface Perfil {
  nome: string;
  sobrenome: string;
  cargo: string;
  foto: string;
}

interface Seguranca {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
}

export default function Configuracoes() {
  const fotoInputRef = useRef<HTMLInputElement>(null);

  const [perfil, setPerfil] = useState<Perfil>({
    nome: "Mariana",
    sobrenome: "Silva",
    cargo: "Gestora de projetos",
    foto: "",
  });

  const [seguranca, setSeguranca] = useState<Seguranca>({
    senhaAtual: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [mensagem, setMensagem] = useState<Mensagem>({
    tipo: "",
    texto: "",
  });

  const iniciaisUsuario = `${perfil.nome.charAt(0)}${perfil.sobrenome.charAt(
    0
  )}`.toUpperCase();

  function handlePerfilChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setPerfil((prev) => ({ ...prev, [name]: value }));
  }

  function handleSegurancaChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setSeguranca((prev) => ({ ...prev, [name]: value }));
  }

  function handleFotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMensagem({ tipo: "erro", texto: "A foto deve ter no máximo 5MB." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPerfil((prev) => ({ ...prev, foto: String(reader.result ?? "") }));
    };
    reader.readAsDataURL(file);
  }

  function handleSalvarPerfil(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensagem({
      tipo: "sucesso",
      texto: "Informações de perfil atualizadas com sucesso!",
    });
    window.setTimeout(() => setMensagem({ tipo: "", texto: "" }), 4000);
  }

  function handleAlterarSenha(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      !seguranca.senhaAtual ||
      !seguranca.novaSenha ||
      !seguranca.confirmarNovaSenha
    ) {
      setMensagem({
        tipo: "erro",
        texto: "Preencha todos os campos de senha.",
      });
      return;
    }
    if (seguranca.novaSenha !== seguranca.confirmarNovaSenha) {
      setMensagem({
        tipo: "erro",
        texto: "A nova senha e a confirmação não coincidem.",
      });
      return;
    }

    setMensagem({ tipo: "sucesso", texto: "Senha alterada com sucesso!" });
    setSeguranca({ senhaAtual: "", novaSenha: "", confirmarNovaSenha: "" });
    window.setTimeout(() => setMensagem({ tipo: "", texto: "" }), 4000);
  }

  return (
    <div className="min-h-full flex min-w-0 flex-1 flex-col bg-[#f3f4f6] font-['Inter',sans-serif] text-[#1f2937]">
      <AdminHeader titulo="Configurações" />

      <main className="mx-auto w-full max-w-[1400px] space-y-8 p-8">
        {mensagem.texto && (
          <div
            className={`rounded-lg p-4 text-sm font-semibold ${
              mensagem.tipo === "erro"
                ? "border border-red-200 bg-red-50 text-red-700"
                : "border border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {mensagem.texto}
          </div>
        )}

        {/* Bloco Perfil */}
        <section className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-cyan-50 text-[#1d70b8]">
              <LuUser size={20} />
            </div>
            <h2 className="text-lg font-extrabold text-[#111827]">Perfil</h2>
          </div>

          <p className="mb-6 text-sm text-slate-500">
            Atualize suas informações pessoais e como você aparece no sistema.
          </p>

          <form onSubmit={handleSalvarPerfil} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Campo
                label="Nome"
                name="nome"
                value={perfil.nome}
                onChange={handlePerfilChange}
                placeholder="Ex.: Mariana"
              />
              <Campo
                label="Sobrenome"
                name="sobrenome"
                value={perfil.sobrenome}
                onChange={handlePerfilChange}
                placeholder="Ex.: Silva"
              />
              <Campo
                label="Cargo"
                name="cargo"
                value={perfil.cargo}
                onChange={handlePerfilChange}
                placeholder="Ex.: Gestora de projetos"
              />

              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                  Foto
                </label>
                <input
                  type="file"
                  ref={fotoInputRef}
                  onChange={handleFotoChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fotoInputRef.current?.click()}
                  className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-100"
                >
                  <LuUpload className="h-4 w-4 text-slate-400" />
                  <span className="truncate">
                    {perfil.foto
                      ? "Foto carregada com sucesso!"
                      : "Upload de arquivo (PNG, JPG, JPEG)"}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="rounded-lg bg-[#1d70b8] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#155a96]"
              >
                Atualizar perfil
              </button>
            </div>
          </form>
        </section>

        {/* Bloco Segurança */}
        <section className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <LuShield size={20} />
            </div>
            <h2 className="text-lg font-extrabold text-[#111827]">Segurança</h2>
          </div>

          <form onSubmit={handleAlterarSenha} className="space-y-5 mt-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <CampoSenha
                label="Senha atual"
                name="senhaAtual"
                value={seguranca.senhaAtual}
                onChange={handleSegurancaChange}
                placeholder="Digite sua senha atual."
                mostrar={mostrarSenhaAtual}
                onToggle={() => setMostrarSenhaAtual((v) => !v)}
              />
              <CampoSenha
                label="Nova senha"
                name="novaSenha"
                value={seguranca.novaSenha}
                onChange={handleSegurancaChange}
                placeholder="Digite a nova senha."
                mostrar={mostrarNovaSenha}
                onToggle={() => setMostrarNovaSenha((v) => !v)}
              />
              <CampoSenha
                label="Confirmar nova senha"
                name="confirmarNovaSenha"
                value={seguranca.confirmarNovaSenha}
                onChange={handleSegurancaChange}
                placeholder="Confirme a nova senha."
                mostrar={mostrarConfirmarSenha}
                onToggle={() => setMostrarConfirmarSenha((v) => !v)}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1d70b8] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#155a96]"
              >
                <LuLock size={16} />
                Alterar senha
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

/* ------------------------------ Campo texto ------------------------------ */
interface CampoProps {
  label: string;
  name: keyof Perfil;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function Campo({ label, name, value, onChange, placeholder }: CampoProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
      />
    </div>
  );
}

/* ------------------------------ Campo senha ------------------------------ */
interface CampoSenhaProps {
  label: string;
  name: keyof Seguranca;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  mostrar: boolean;
  onToggle: () => void;
}

function CampoSenha({
  label,
  name,
  value,
  onChange,
  placeholder,
  mostrar,
  onToggle,
}: CampoSenhaProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
        {label}
      </label>
      <div className="relative">
        <input
          type={mostrar ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={mostrar ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {mostrar ? <LuEyeOff size={18} /> : <LuEye size={18} />}
        </button>
      </div>
    </div>
  );
}