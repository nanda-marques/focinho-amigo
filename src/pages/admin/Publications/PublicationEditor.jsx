import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuCalendarDays, LuImage, LuBold, LuItalic, LuUnderline, LuAlignLeft, LuAlignCenter, LuLink, LuSave, LuEye } from "react-icons/lu";
import { publicacoesApi } from "../../../services/publicacoesApi";

const vazio = {
  titulo: "", categoria: "Notícias", dataPublicacao: new Date().toISOString().slice(0, 10),
  imagem: "", descricao: "", conteudo: "", status: "rascunho", destaque: false,
  urgente: false, autor: "",
};

const categorias = ["Notícias", "Campanhas", "Eventos", "Adoção", "Campanha Urgente"];

export default function PublicationEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(vazio);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const arquivoRef = useRef(null);
  const conteudoRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    publicacoesApi.buscar(id).then((p) => setForm({ ...vazio, ...p }))
      .catch((e) => setErro(e.message));
  }, [id]);

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function selecionarImagem(evento) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
      setErro("Selecione uma imagem JPG, PNG ou WebP.");
      return;
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      setErro("A imagem deve ter no máximo 5 MB.");
      return;
    }
    const leitor = new FileReader();
    leitor.onload = () => alterar("imagem", leitor.result);
    leitor.readAsDataURL(arquivo);
  }

  function formatar(comando, valor = null) {
    conteudoRef.current?.focus();
    document.execCommand(comando, false, valor);
    alterar("conteudo", conteudoRef.current?.innerHTML || "");
  }

  async function salvar(status = form.status, irPreview = false) {
    if (!form.titulo.trim()) return setErro("Preencha o título da publicação.");
    setSalvando(true); setErro("");
    try {
      const salva = await publicacoesApi.salvar({ ...form, status, id: id || undefined });
      
      if (irPreview) {
        // Se clicou em Pré-visualizar, vai para a tela de preview
        navigate(`/admin/publicacoes/${salva.id}/preview`);
      } else {
        // Se salvou rascunho ou publicou, volta para a lista de publicações
        navigate("/admin/publicacoes");
      }
    } catch (e) {
      setErro(e.message || "Não foi possível salvar. Verifique se o backend está funcionando.");
    } finally { setSalvando(false); }
  }

  return (
    <main className="min-h-screen bg-[#f1f1f1] px-5 py-6 md:px-8">
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold text-[#202b40]">{id ? "Editar Publicação" : "Nova Publicação"}</h1>
        <div className="flex flex-wrap gap-3">
          <button disabled={salvando} onClick={() => salvar("rascunho")} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 disabled:opacity-50"><LuSave className="mr-2 inline" />Salvar Rascunho</button>
          <button disabled={salvando} onClick={() => salvar(form.status, true)} className="rounded-lg border border-blue-600 bg-white px-4 py-2.5 text-sm font-bold text-blue-700 disabled:opacity-50"><LuEye className="mr-2 inline" />Pré-visualizar</button>
          <button disabled={salvando} onClick={() => salvar("publicado")} className="rounded-lg bg-[#ffb800] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{salvando ? "Salvando..." : "Publicar"}</button>
        </div>
      </header>

      {erro && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{erro}</p>}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-bold text-[#202b40]">Título da Publicação
            <input value={form.titulo} onChange={(e) => alterar("titulo", e.target.value)} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 font-normal outline-none focus:border-blue-500" placeholder="Digite o título" />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-bold text-[#202b40]">Categoria
              <select value={form.categoria} onChange={(e) => alterar("categoria", e.target.value)} className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 font-normal">
                {categorias.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block text-sm font-bold text-[#202b40]">Data de Publicação
              <span className="relative mt-2 block"><LuCalendarDays className="absolute right-3 top-3 text-slate-500" /><input type="date" value={form.dataPublicacao} onChange={(e) => alterar("dataPublicacao", e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-3 font-normal" /></span>
            </label>
          </div>

          <div>
            <p className="mb-2 text-sm font-bold text-[#202b40]">Imagem Destacada</p>
            <div onClick={() => arquivoRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const arquivo = e.dataTransfer.files?.[0]; if (arquivo) { const dt = new DataTransfer(); dt.items.add(arquivo); arquivoRef.current.files = dt.files; arquivoRef.current.dispatchEvent(new Event("change", { bubbles: true })); } }}
              className="cursor-pointer rounded-lg border border-dashed border-slate-300 p-5 text-center hover:bg-slate-50">
              {form.imagem ? <img src={form.imagem} alt="Prévia da imagem destacada" className="mx-auto max-h-56 max-w-full rounded-2xl object-cover" /> : <LuImage className="mx-auto my-6 text-slate-400" size={40} />}
              <p className="mt-3 font-semibold text-blue-600">{form.imagem ? "Substituir imagem" : "Selecionar imagem"}</p>
              <p className="mt-2 text-xs text-slate-500">Clique ou arraste um arquivo JPG, PNG ou WebP (até 5 MB)</p>
              <input ref={arquivoRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={selecionarImagem} className="hidden" />
            </div>
          </div>

          <label className="block text-sm font-bold text-[#202b40]">Descrição Resumida (Card do site)
            <textarea value={form.descricao} onChange={(e) => alterar("descricao", e.target.value)} rows={3} maxLength={500} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 font-normal" placeholder="Resumo que aparecerá nos cards..." />
          </label>

          <div>
            <p className="mb-2 text-sm font-bold text-[#202b40]">Conteúdo Completo</p>
            <div className="flex gap-1 border border-slate-300 bg-slate-50 p-2">
              <button type="button" title="Negrito" onClick={() => formatar("bold")} className="rounded p-1.5 hover:bg-slate-200"><LuBold /></button>
              <button type="button" title="Itálico" onClick={() => formatar("italic")} className="rounded p-1.5 hover:bg-slate-200"><LuItalic /></button>
              <button type="button" title="Sublinhado" onClick={() => formatar("underline")} className="rounded p-1.5 hover:bg-slate-200"><LuUnderline /></button>
              <button type="button" title="Alinhar à esquerda" onClick={() => formatar("justifyLeft")} className="rounded p-1.5 hover:bg-slate-200"><LuAlignLeft /></button>
              <button type="button" title="Centralizar" onClick={() => formatar("justifyCenter")} className="rounded p-1.5 hover:bg-slate-200"><LuAlignCenter /></button>
              <button type="button" title="Inserir link" onClick={() => { const url = window.prompt("URL do link:"); if (url) formatar("createLink", url); }} className="rounded p-1.5 hover:bg-slate-200"><LuLink /></button>
            </div>
            <div ref={conteudoRef} contentEditable suppressContentEditableWarning onInput={(e) => alterar("conteudo", e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: form.conteudo }} className="min-h-44 rounded-b-md border border-t-0 border-slate-300 bg-white p-4 text-sm leading-6 outline-none focus:border-blue-500" />
          </div>
        </section>

        <aside className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-bold text-[#202b40]">Definições de Status
            <select value={form.status} onChange={(e) => alterar("status", e.target.value)} className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 font-normal">
              <option value="rascunho">Rascunho</option><option value="publicado">Publicado</option><option value="agendado">Agendado</option>
            </select>
          </label>
          <label className="flex items-start justify-between gap-4"><span><strong className="block text-sm text-[#202b40]">Publicação em Destaque</strong><small className="text-xs text-slate-500">Colocará o post no banner principal</small></span><input type="checkbox" checked={form.destaque} onChange={(e) => alterar("destaque", e.target.checked)} className="mt-1 h-4 w-4 accent-blue-600" /></label>
          <label className="flex items-start justify-between gap-4"><span><strong className="block text-sm text-[#202b40]">Campanha Urgente</strong><small className="text-xs text-slate-500">Destacará com visual amarelo no site</small></span><input type="checkbox" checked={form.urgente} onChange={(e) => alterar("urgente", e.target.checked)} className="mt-1 h-4 w-4 accent-amber-500" /></label>
          <label className="block text-sm font-bold text-[#202b40]">Autor(a)
            <input value={form.autor} onChange={(e) => alterar("autor", e.target.value)} placeholder="Ex.: Mariana Silva" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 font-normal" />
          </label>
          <p className="border-t pt-4 text-xs leading-5 text-slate-500">As alterações ficam no armazenamento temporário do backend até a integração com o banco de dados.</p>
        </aside>
      </div>
    </main>
  );
}
