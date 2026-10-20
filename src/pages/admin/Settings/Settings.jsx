import { useState, useRef } from "react";
import { LuUser, LuShield, LuUpload, LuEye, LuEyeOff, LuLock } from "react-icons/lu";

export default function Configuracoes() {
  const fotoInputRef = useRef(null);

  // Estados do formulário de Perfil
  const [perfil, setPerfil] = useState({
    nome: "Mariana",
    sobrenome: "Silva",
    cargo: "Gestora de projetos",
    foto: "",
  });

  // Estados do formulário de Segurança
  const [seguranca, setSeguranca] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });

  // Estados para alternar visibilidade das senhas
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  // Obter iniciais do nome e sobrenome (ex: "Mariana Silva" -> "MS")
  const iniciaisUsuario = `${perfil.nome.charAt(0)}${perfil.sobrenome.charAt(0)}`.toUpperCase();

  function handlePerfilChange(e) {
    const { name, value } = e.target;
    setPerfil((prev) => ({ ...prev, [name]: value }));
  }

  function handleSegurancaChange(e) {
    const { name, value } = e.target;
    setSeguranca((prev) => ({ ...prev, [name]: value }));
  }

  // Upload da Foto de Perfil em Base64
  function handleFotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMensagem({ tipo: "erro", texto: "A foto deve ter no máximo 5MB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPerfil((prev) => ({ ...prev, foto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  // Salvar Perfil
  function handleSalvarPerfil(e) {
    e.preventDefault();
    setMensagem({ tipo: "sucesso", texto: "Informações de perfil atualizadas com sucesso!" });
    setTimeout(() => setMensagem({ tipo: "", texto: "" }), 4000);
  }

  // Alterar Senha
  function handleAlterarSenha(e) {
    e.preventDefault();
    if (!seguranca.senhaAtual || !seguranca.novaSenha || !seguranca.confirmarNovaSenha) {
      setMensagem({ tipo: "erro", texto: "Preencha todos os campos de senha." });
      return;
    }
    if (seguranca.novaSenha !== seguranca.confirmarNovaSenha) {
      setMensagem({ tipo: "erro", texto: "A nova senha e a confirmação não coincidem." });
      return;
    }

    setMensagem({ tipo: "sucesso", texto: "Senha alterada com sucesso!" });
    setSeguranca({ senhaAtual: "", novaSenha: "", confirmarNovaSenha: "" });
    setTimeout(() => setMensagem({ tipo: "", texto: "" }), 4000);
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-['Inter',sans-serif] text-[#1f2937]">
      {/* Top Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
        <h1 className="text-2xl font-extrabold text-[#111827]">Configurações</h1>

        <div className="flex items-center gap-3">
          {perfil.foto ? (
            <img
              src={perfil.foto}
              alt={`${perfil.nome} ${perfil.sobrenome}`}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-200 font-bold text-slate-600">
              {iniciaisUsuario}
            </div>
          )}

          <div>
            <p className="text-sm font-bold text-[#111827]">
              {perfil.nome} {perfil.sobrenome}
            </p>
            <p className="text-xs text-slate-500">{perfil.cargo}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] space-y-8 p-8">
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
              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                  Nome
                </label>
                <input
                  type="text"
                  name="nome"
                  value={perfil.nome}
                  onChange={handlePerfilChange}
                  placeholder="Ex.: Mariana"
                  className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                  Sobrenome
                </label>
                <input
                  type="text"
                  name="sobrenome"
                  value={perfil.sobrenome}
                  onChange={handlePerfilChange}
                  placeholder="Ex.: Silva"
                  className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                  Cargo
                </label>
                <input
                  type="text"
                  name="cargo"
                  value={perfil.cargo}
                  onChange={handlePerfilChange}
                  placeholder="Ex.: Gestora de projetos"
                  className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
                />
              </div>

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
                    {perfil.foto ? "Foto carregada com sucesso!" : "Upload de arquivo (PNG, JPG, JPEG)"}
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
              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                  Senha atual
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenhaAtual ? "text" : "password"}
                    name="senhaAtual"
                    value={seguranca.senhaAtual}
                    onChange={handleSegurancaChange}
                    placeholder="Digite sua senha atual."
                    className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {mostrarSenhaAtual ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                  Nova senha
                </label>
                <div className="relative">
                  <input
                    type={mostrarNovaSenha ? "text" : "password"}
                    name="novaSenha"
                    value={seguranca.novaSenha}
                    onChange={handleSegurancaChange}
                    placeholder="Digite a nova senha."
                    className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {mostrarNovaSenha ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <input
                    type={mostrarConfirmarSenha ? "text" : "password"}
                    name="confirmarNovaSenha"
                    value={seguranca.confirmarNovaSenha}
                    onChange={handleSegurancaChange}
                    placeholder="Confirme a nova senha."
                    className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {mostrarConfirmarSenha ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                  </button>
                </div>
              </div>
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