import { useEffect, useRef, useState } from "react";
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
import { adminApi } from "../../../services/adminApi";
import { authApi } from "../../../services/authApi";
import { useFotoPerfil } from "../../../hooks/useFotoPerfil";

type TipoMensagem = "erro" | "sucesso" | "";

interface Mensagem {
  tipo: TipoMensagem;
  texto: string;
}

interface Seguranca {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
}

export default function Configuracoes() {
  const fotoInputRef = useRef<HTMLInputElement>(null);

  const [perfil, setPerfil] = useState({
    nomeCompleto: "",
    email: "",
    cargo: "",
    foto: "", // path do bucket privado (ex.: "admins/5/1717_foto.jpg")
  });
  const [arquivoFoto, setArquivoFoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [carregando, setCarregando] = useState(true);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  const [seguranca, setSeguranca] = useState<Seguranca>({
    senhaAtual: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [mensagem, setMensagem] = useState<Mensagem>({ tipo: "", texto: "" });

  // Resolve o path do bucket privado em signed URL
  const { url: fotoUrlAtual } = useFotoPerfil(perfil.foto);

  // Preview local enquanto há arquivo selecionado (antes de salvar)
  useEffect(() => {
    if (!arquivoFoto) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(arquivoFoto);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [arquivoFoto]);

  useEffect(() => {
    let ativo = true;
    adminApi
      .meuPerfil()
      .then((p) => {
        if (!ativo) return;
        setPerfil({
          nomeCompleto: p.nomeCompleto,
          email: p.email,
          cargo: p.cargo ?? "",
          foto: p.fotoPath ?? "", 
        });
      })
      .catch((e: unknown) => {
        if (ativo) {
          setMensagem({
            tipo: "erro",
            texto: e instanceof Error ? e.message : "Erro ao carregar perfil.",
          });
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

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

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setMensagem({ tipo: "erro", texto: "Use PNG, JPG ou JPEG." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMensagem({ tipo: "erro", texto: "A foto deve ter no máximo 2MB." });
      return;
    }

    setArquivoFoto(file);
    setMensagem({ tipo: "", texto: "" });
  }

  async function handleSalvarPerfil(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setSalvandoPerfil(true);
  setMensagem({ tipo: "", texto: "" });

  try {
    // Atualiza nome + email
    const resp = await adminApi.atualizarPerfil({
      nomeCompleto: perfil.nomeCompleto,
      email: perfil.email,
    });

    // Sincroniza localStorage 
    const u = authApi.usuarioAtual();
    if (u) {
      const usuarioAtualizado = {
        ...u,
        nomeCompleto: resp.usuario.nomeCompleto ?? u.nomeCompleto,
        email: resp.usuario.email ?? u.email,
      };
      localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
      window.dispatchEvent(new Event("usuario-atualizado"));
    }

    // Se tem foto nova, envia e atualiza o path
    if (arquivoFoto) {
      const up = await adminApi.atualizarFotoPerfil(arquivoFoto);

      setPerfil((p) => ({ ...p, foto: up.path }));

      const u2 = authApi.usuarioAtual();
      if (u2) {
        localStorage.setItem(
          "usuario",
          JSON.stringify({ ...u2, fotoPath: up.path })
        );
        window.dispatchEvent(new Event("usuario-atualizado"));
      }
      setArquivoFoto(null);
    }

    setMensagem({
      tipo: "sucesso",
      texto: resp.mensagem || "Perfil atualizado.",
    });
    window.setTimeout(() => setMensagem({ tipo: "", texto: "" }), 4000);
  } catch (err: unknown) {
    setMensagem({
      tipo: "erro",
      texto: err instanceof Error ? err.message : "Erro ao salvar perfil.",
    });
    } finally {
      setSalvandoPerfil(false);
    }
  }

  async function handleAlterarSenha(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      !seguranca.senhaAtual ||
      !seguranca.novaSenha ||
      !seguranca.confirmarNovaSenha
    ) {
      setMensagem({ tipo: "erro", texto: "Preencha todos os campos de senha." });
      return;
    }
    if (seguranca.novaSenha !== seguranca.confirmarNovaSenha) {
      setMensagem({
        tipo: "erro",
        texto: "A nova senha e a confirmação não coincidem.",
      });
      return;
    }

    setSalvandoSenha(true);
    setMensagem({ tipo: "", texto: "" });
    try {
      const resp = await adminApi.alterarSenha({
        senhaAtual: seguranca.senhaAtual,
        novaSenha: seguranca.novaSenha,
      });
      setMensagem({ tipo: "sucesso", texto: resp.mensagem });
      setSeguranca({ senhaAtual: "", novaSenha: "", confirmarNovaSenha: "" });
      window.setTimeout(() => setMensagem({ tipo: "", texto: "" }), 4000);
    } catch (err: unknown) {
      setMensagem({
        tipo: "erro",
        texto: err instanceof Error ? err.message : "Erro ao alterar senha.",
      });
    } finally {
      setSalvandoSenha(false);
    }
  }

  const iniciaisUsuario =
    perfil.nomeCompleto
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AD";

  // Qual imagem mostrar no avatar: preview local > foto atual > iniciais
  const avatarSrc = previewUrl || fotoUrlAtual || null;

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

        {carregando ? (
          <p className="text-slate-500">Carregando perfil...</p>
        ) : (
          <>
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
                    label="Nome completo"
                    name="nomeCompleto"
                    value={perfil.nomeCompleto}
                    onChange={handlePerfilChange}
                    placeholder="Ex.: Mariana Silva"
                  />
                  <Campo
                    label="E-mail"
                    name="email"
                    value={perfil.email}
                    onChange={handlePerfilChange}
                    placeholder="ex.: mariana@focinhoamigo.org"
                  />
                  <Campo
                    label="Cargo"
                    name="cargo"
                    value={perfil.cargo}
                    onChange={() => {}}
                    placeholder="Definido pelo sistema"
                    readOnly
                  />

                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                      Foto
                    </label>

                    <input
                      type="file"
                      ref={fotoInputRef}
                      onChange={handleFotoChange}
                      accept="image/png,image/jpeg"
                      className="hidden"
                    />

                    <div className="flex items-center gap-3">
                      {/* avatar: preview > foto atual > iniciais */}
                      <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-[#e8f3fd] text-[13px] font-bold text-[#0874ca]">
                        {avatarSrc ? (
                          <img
                            src={avatarSrc}
                            alt="Foto de perfil"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>{iniciaisUsuario}</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => fotoInputRef.current?.click()}
                        className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-100"
                      >
                        <LuUpload className="h-4 w-4 text-slate-400" />
                        <span className="truncate">
                          {arquivoFoto
                            ? arquivoFoto.name
                            : perfil.foto
                            ? "Trocar foto"
                            : "Upload de arquivo (PNG, JPG, JPEG)"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={salvandoPerfil}
                    className="rounded-lg bg-[#1d70b8] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#155a96] disabled:opacity-60"
                  >
                    {salvandoPerfil ? "Salvando..." : "Atualizar perfil"}
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
                    disabled={salvandoSenha}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1d70b8] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#155a96] disabled:opacity-60"
                  >
                    <LuLock size={16} />
                    {salvandoSenha ? "Alterando..." : "Alterar senha"}
                  </button>
                </div>
              </form>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

// Campo texto 
interface CampoProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
}

function Campo({
  label,
  name,
  value,
  onChange,
  placeholder,
  readOnly,
}: CampoProps) {
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
        readOnly={readOnly}
        className={`w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white ${
          readOnly ? "cursor-not-allowed opacity-60" : ""
        }`}
      />
    </div>
  );
}

// Campo senha
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