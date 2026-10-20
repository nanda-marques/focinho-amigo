import { useEffect, useState, useRef } from "react";
import { LuUpload, LuPencil, LuTrash2, LuX } from "react-icons/lu";
import { animaisApi } from "../../../services/animaisApi";

export default function Animais() {
  const fileInputRef = useRef(null);
  const csvInputRef = useRef(null);

  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const [editandoId, setEditandoId] = useState(null);

  const formInicial = {
    nome: "",
    especie: "",
    raca: "",
    idade: "",
    porte: "",
    peso: "",
    castracao: "Pendente",
    temperamento: "",
    cor: "",
    foto: "",
  };

  const [form, setForm] = useState(formInicial);

  // Carregar lista de animais
  async function carregarAnimais() {
    setCarregando(true);
    setMensagem({ tipo: "", texto: "" });
    try {
      const dados = await animaisApi.listar();
      setAnimais(Array.isArray(dados) ? dados : []);
    } catch (e) {
      setMensagem({
        tipo: "erro",
        texto: "Não foi possível carregar a lista de animais. Verifique se o backend está em execução.",
      });
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarAnimais();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Upload da Foto
  function handleFotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMensagem({ tipo: "erro", texto: "A foto deve ter no máximo 5MB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, foto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  // Iniciar modo de edição
  function IniciarEdicao(animal) {
    setEditandoId(animal.id);
    setForm({
      nome: animal.nome || "",
      especie: animal.especie || "",
      raca: animal.raca || "",
      idade: animal.idade || "",
      porte: animal.porte || "",
      peso: animal.peso || "",
      castracao: animal.statusCastracao || animal.castracao || "Pendente",
      temperamento: animal.temperamento || "",
      cor: animal.cor || "",
      foto: animal.foto || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Cancelar edição
  function cancelarEdicao() {
    setEditandoId(null);
    setForm(formInicial);
  }

  // Submeter formulário (Criar ou Editar)
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome.trim()) {
      setMensagem({ tipo: "erro", texto: "Por favor, preencha o nome do animal." });
      return;
    }

    setSalvando(true);
    setMensagem({ tipo: "", texto: "" });

    try {
      if (editandoId) {
        await animaisApi.atualizar(editandoId, form);
        setMensagem({ tipo: "sucesso", texto: "Animal atualizado com sucesso!" });
      } else {
        await animaisApi.criar(form);
        setMensagem({ tipo: "sucesso", texto: "Animal cadastrado com sucesso!" });
      }

      cancelarEdicao();
      await carregarAnimais();
    } catch (err) {
      setMensagem({
        tipo: "erro",
        texto: err.message || "Erro ao salvar os dados do animal.",
      });
    } finally {
      setSalvando(false);
    }
  }

  // Excluir Animal
  async function handleExcluir(animal) {
    const confirmou = window.confirm(`Deseja realmente excluir "${animal.nome}"?`);
    if (!confirmou) return;

    try {
      await animaisApi.excluir(animal.id);
      setMensagem({ tipo: "sucesso", texto: `"${animal.nome}" foi removido com sucesso.` });
      
      if (editandoId === animal.id) {
        cancelarEdicao();
      }

      await carregarAnimais();
    } catch (err) {
      setMensagem({
        tipo: "erro",
        texto: err.message || "Não foi possível excluir o animal.",
      });
    }
  }

  // Importar CSV
  async function handleImportarCSV(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setCarregando(true);
      await animaisApi.importarCSV(file);
      setMensagem({ tipo: "sucesso", texto: "CSV importado com sucesso!" });
      await carregarAnimais();
    } catch (err) {
      setMensagem({
        tipo: "erro",
        texto: err.message || "Erro ao importar o arquivo CSV.",
      });
    } finally {
      setCarregando(false);
    }
  }

  function getCastracaoBadgeClass(status) {
    const val = (status || "").toLowerCase();
    if (val.includes("castrad")) {
      return "bg-emerald-100 text-emerald-700 font-bold";
    }
    if (val.includes("agendad")) {
      return "bg-amber-100 text-amber-700 font-bold";
    }
    return "bg-slate-100 text-slate-600 font-bold";
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-['Inter',sans-serif] text-[#1f2937]">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
        <h1 className="text-2xl font-extrabold text-[#111827]">Animais</h1>

        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-200 font-bold text-slate-600">
            MS
          </div>
          <div>
            <p className="text-sm font-bold text-[#111827]">Mariana Silva</p>
            <p className="text-xs text-slate-500">Gestora de Projetos</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-8 p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-[#111827]">
            {editandoId ? "Editar Animal" : "Cadastro de Animais"}
          </h2>

          <input
            type="file"
            ref={csvInputRef}
            onChange={handleImportarCSV}
            accept=".csv"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => csvInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1d70b8] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#155a96]"
          >
            <LuUpload size={18} />
            Importar CSV
          </button>
        </div>

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

        {/* Ficha de Cadastro/Edição */}
        <section className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#111827]">
              {editandoId ? "Editar Ficha do Animal" : "Ficha"}
            </h3>

            {editandoId && (
              <button
                type="button"
                onClick={cancelarEdicao}
                className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-700"
              >
                <LuX size={16} /> Cancelar Edição
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                  Nome do animal
                </label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Ex.: Bela"
                  className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                  Espécie
                </label>
                <input
                  type="text"
                  name="especie"
                  value={form.especie}
                  onChange={handleChange}
                  placeholder="Ex.: Cão"
                  className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                  Idade
                </label>
                <input
                  type="text"
                  name="idade"
                  value={form.idade}
                  onChange={handleChange}
                  placeholder="Ex.: 2 anos"
                  className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                  Porte
                </label>
                <input
                  type="text"
                  name="porte"
                  value={form.porte}
                  onChange={handleChange}
                  placeholder="Ex.: Grande"
                  className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                  Peso
                </label>
                <input
                  type="text"
                  name="peso"
                  value={form.peso}
                  onChange={handleChange}
                  placeholder="Ex.: 4kg"
                  className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                  Castração
                </label>
                <input
                  type="text"
                  name="castracao"
                  value={form.castracao}
                  onChange={handleChange}
                  placeholder="Agendada"
                  className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                  Temperamento
                </label>
                <input
                  type="text"
                  name="temperamento"
                  value={form.temperamento}
                  onChange={handleChange}
                  placeholder="Ex.: Dócil"
                  className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                  Cor
                </label>
                <input
                  type="text"
                  name="cor"
                  value={form.cor}
                  onChange={handleChange}
                  placeholder="Preto"
                  className="w-full rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-2.5 text-sm outline-none transition focus:border-[#1d70b8] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-extrabold text-[#374151]">
                Foto
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFotoChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-[#f9fafb] px-4 py-3 text-sm text-slate-500 hover:bg-slate-100"
              >
                <LuUpload className="h-5 w-5 text-slate-400" />
                <span>
                  {form.foto
                    ? "Foto selecionada!"
                    : "Upload de arquivo (PNG, JPG, JPEG)"}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={salvando}
                className="rounded-lg bg-[#1d70b8] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#155a96] disabled:opacity-50"
              >
                {salvando
                  ? "Salvando..."
                  : editandoId
                  ? "Salvar Alterações"
                  : "Cadastrar"}
              </button>

              {editandoId && (
                <button
                  type="button"
                  onClick={cancelarEdicao}
                  className="rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-300"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Tabela com Ações ao lado de cada animal */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-extrabold text-[#111827]">
            Animais cadastrados
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-slate-100 bg-[#f9fafb] text-xs font-extrabold text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">Nome</th>
                  <th className="px-5 py-3.5">Espécie</th>
                  <th className="px-5 py-3.5">Raça</th>
                  <th className="px-5 py-3.5">Status Castração</th>
                  <th className="px-5 py-3.5">Data</th>
                  <th className="px-5 py-3.5 text-center">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {carregando ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      Carregando animais...
                    </td>
                  </tr>
                ) : animais.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      Nenhum animal cadastrado.
                    </td>
                  </tr>
                ) : (
                  animais.map((animal) => (
                    <tr
                      key={animal.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4 font-bold text-[#111827]">
                        {animal.nome}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {animal.especie || "—"}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {animal.raca || "Vira-lata"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block rounded-md px-3 py-1 text-xs ${getCastracaoBadgeClass(
                            animal.statusCastracao || animal.castracao
                          )}`}
                        >
                          {animal.statusCastracao || animal.castracao || "Pendente"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {animal.data || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            title="Editar"
                            onClick={() => IniciarEdicao(animal)}
                            className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-[#1d70b8]"
                          >
                            <LuPencil size={17} />
                          </button>
                          <button
                            type="button"
                            title="Excluir"
                            onClick={() => handleExcluir(animal)}
                            className="rounded-md p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <LuTrash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}