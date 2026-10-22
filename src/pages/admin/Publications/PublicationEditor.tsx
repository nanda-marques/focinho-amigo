import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuCalendarDays, LuImage, LuBold, LuItalic, LuUnderline, LuAlignLeft, LuAlignCenter, LuLink, LuSave, LuEye } from "react-icons/lu";
import { publicacoesApi, type Publicacao } from "../../../services/publicacoesApi";

type FormPublicacao = Omit<Publicacao, "id">;

// Pega a mensagem de um erro desconhecido (mesmo comportamento de e.message)
function mensagem(e: unknown): string {
  return e instanceof Error ? e.message : "";
}

const vazio: FormPublicacao = {
  titulo: "", categoria: "Notícias", dataPublicacao: new Date().toISOString().slice(0, 10),
  imagem: "", descricao: "", conteudo: "", status: "rascunho", destaque: false,
  urgente: false, autor: "",
};

const categorias = ["Notícias", "Campanhas", "Eventos", "Adoção", "Campanha Urgente"];

/* ---------- Estilos (só design) ---------- */
const cardClass = "rounded-[17px] border border-[#e2e2e2] bg-white shadow-[0_2px_3px_rgb(0_0_0/22%)]";
const labelClass = "block text-[13px] font-bold text-[#202b3e]";
const fieldClass =
  "mt-2 flex h-[44px] items-center gap-2.5 rounded-[8px] border border-[#dce5ef] bg-[#f7f9fb] px-3.5 font-normal text-[#687d9a] transition-all duration-150 focus-within:border-[#2174b7] focus-within:ring-4 focus-within:ring-[#2174b7]/10";
const inputClass =
  "w-full min-w-0 border-0 bg-transparent p-0 text-[13.5px] font-normal text-[#273449] outline-none placeholder:text-[#8a9ab2]";
const botaoCabecalho =
  "flex h-[36px] cursor-pointer items-center gap-2 rounded-[8px] px-4 text-[13px] font-bold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50";
const botaoBarra =
  "flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[6px] border-0 bg-transparent text-[#4b5b73] hover:bg-[#e8eef5]";
const interruptorBase =
  "relative h-[24px] w-[46px] shrink-0 cursor-pointer appearance-none rounded-full border-2 border-[#cbd5e1] bg-white transition-colors before:absolute before:left-[4px] before:top-1/2 before:h-[12px] before:w-[12px] before:-translate-y-1/2 before:rounded-full before:bg-[#cbd5e1] before:transition-all before:content-[''] checked:before:left-[26px]";

export default function PublicationEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormPublicacao>(vazio);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const arquivoRef = useRef<HTMLInputElement>(null);
  const conteudoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    publicacoesApi.buscar(id).then((p) => setForm({ ...vazio, ...p }))
      .catch((e: unknown) => setErro(mensagem(e)));
  }, [id]);

  function alterar<K extends keyof FormPublicacao>(campo: K, valor: FormPublicacao[K]) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function selecionarImagem(evento: React.ChangeEvent<HTMLInputElement>) {
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
    leitor.onload = () => alterar("imagem", String(leitor.result));
    leitor.readAsDataURL(arquivo);
  }

  function formatar(comando: string, valor?: string) {
    conteudoRef.current?.focus();
    document.execCommand(comando, false, valor);
    alterar("conteudo", conteudoRef.current?.innerHTML || "");
  }

  async function salvar(status = form.status, irPreview = false) {
    if (!form.titulo.trim()) return setErro("Preencha o título da publicação.");
    setSalvando(true); setErro("");
    try {
      
const salva = await publicacoesApi.salvar({
  ...form,
  status,
  id: id || undefined,
});

if (irPreview) {
  if (!salva) {
    throw new Error("Não foi possível obter a publicação salva.");
  }

  navigate(`/admin/publicacoes/${salva.id}/preview`);
} else {
  navigate("/admin/publicacoes");
}

    } catch (e) {
      setErro(mensagem(e) || "Não foi possível salvar. Verifique se o backend está funcionando.");
    } finally { setSalvando(false); }
  }

  return (
    <div className="box-border flex min-h-screen min-w-0 flex-1 flex-col bg-[#f0f0f0] font-['Inter',Arial,sans-serif] text-[#202b3e] *:box-border">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-[#e2e2e2] bg-white py-4 pl-[72px] pr-5 sm:pr-8 lg:px-8 lg:py-5">
        <h1 className="m-0 text-[22px] font-extrabold leading-[1.2] tracking-[-0.5px] sm:text-[26px]">{id ? "Editar Publicação" : "Nova Publicação"}</h1>
        <div className="flex flex-wrap gap-2.5">
          <button disabled={salvando} onClick={() => salvar("rascunho")} className={`${botaoCabecalho} border border-[#dce5ef] bg-white text-[#667b9b] hover:bg-[#f7f9fb]`}><LuSave size={15} />Salvar Rascunho</button>
          <button disabled={salvando} onClick={() => salvar(form.status, true)} className={`${botaoCabecalho} border border-[#2174b7] bg-white text-[#2174b7] hover:bg-[#e8f3fd]`}><LuEye size={15} />Pré-visualizar</button>
          <button disabled={salvando} onClick={() => salvar("publicado")} className={`${botaoCabecalho} border-0 bg-[#ffb800] text-white hover:bg-[#e6a600]`}>{salvando ? "Salvando..." : "Publicar"}</button>
        </div>
      </header>

      <main className="flex-1 p-5 sm:p-6 lg:p-8">
        {erro && <p role="alert" className="m-0 mb-4 rounded-[8px] border border-[#f9c4be] bg-[#fff1f0] px-3.5 py-2.5 text-[13px] font-semibold text-[#b42318]">{erro}</p>}

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_372px]">
          <section className={`${cardClass} flex flex-col gap-5 p-6`}>
            <label className={labelClass}>Título da Publicação
              <div className={fieldClass}>
                <input value={form.titulo} onChange={(e) => alterar("titulo", e.target.value)} className={inputClass} placeholder="Digite o título" />
              </div>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>Categoria
                <div className={fieldClass}>
                  <select value={form.categoria} onChange={(e) => alterar("categoria", e.target.value)} className={`${inputClass} cursor-pointer`}>
                    {categorias.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </label>
              <label className={labelClass}>Data de Publicação
                <div className={`${fieldClass} relative`}>
                  <LuCalendarDays className="pointer-events-none absolute right-[13px] text-[#687d9a]" size={17} />
                  <input type="date" value={form.dataPublicacao} onChange={(e) => alterar("dataPublicacao", e.target.value)} className={`${inputClass} cursor-pointer`} />
                </div>
              </label>
            </div>

            <div>
              <p className={`${labelClass} mb-2`}>Imagem Destacada</p>
              <div onClick={() => arquivoRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const arquivo = e.dataTransfer.files?.[0]; if (arquivo && arquivoRef.current) { const dt = new DataTransfer(); dt.items.add(arquivo); arquivoRef.current.files = dt.files; arquivoRef.current.dispatchEvent(new Event("change", { bubbles: true })); } }}
                className="cursor-pointer rounded-[10px] border border-dashed border-[#c3cedc] bg-white px-4 py-6 text-center transition-colors hover:bg-[#f7f9fb]">
                {form.imagem ? <img src={form.imagem} alt="Prévia da imagem destacada" className="mx-auto max-h-[210px] max-w-full rounded-[16px] object-cover" /> : <LuImage className="mx-auto my-1.5 text-[#8a9ab2]" size={36} />}
                <p className="m-0 mt-2.5 text-[13.5px] font-bold text-[#2174b7]">{form.imagem ? "Substituir imagem" : "Selecionar imagem"}</p>
                <p className="m-0 mt-2 text-[12.5px] text-[#667b9b]">Clique ou arraste um arquivo JPG, PNG ou WebP (até 5 MB)</p>
                <input ref={arquivoRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={selecionarImagem} className="hidden" />
              </div>
            </div>

            <label className={labelClass}>Descrição Resumida (Card do site)
              <textarea value={form.descricao} onChange={(e) => alterar("descricao", e.target.value)} rows={3} maxLength={500} className="mt-2 w-full resize-y rounded-[8px] border border-[#dce5ef] bg-[#f7f9fb] p-3.5 text-[14px] font-normal leading-[1.6] text-[#273449] outline-none placeholder:text-[#8a9ab2] focus:border-[#2174b7] focus:ring-4 focus:ring-[#2174b7]/10" placeholder="Resumo que aparecerá nos cards..." />
            </label>

            <div>
              <p className={`${labelClass} mb-2`}>Conteúdo Completo</p>
              <div className="overflow-hidden rounded-[8px] border border-[#dce5ef] focus-within:border-[#2174b7] focus-within:ring-4 focus-within:ring-[#2174b7]/10">
                <div className="flex flex-wrap items-center gap-0.5 border-b border-[#dce5ef] bg-[#f7f9fb] p-1">
                  <button type="button" title="Negrito" onClick={() => formatar("bold")} className={botaoBarra}><LuBold size={16} /></button>
                  <button type="button" title="Itálico" onClick={() => formatar("italic")} className={botaoBarra}><LuItalic size={16} /></button>
                  <button type="button" title="Sublinhado" onClick={() => formatar("underline")} className={botaoBarra}><LuUnderline size={16} /></button>
                  <button type="button" title="Alinhar à esquerda" onClick={() => formatar("justifyLeft")} className={botaoBarra}><LuAlignLeft size={16} /></button>
                  <button type="button" title="Centralizar" onClick={() => formatar("justifyCenter")} className={botaoBarra}><LuAlignCenter size={16} /></button>
                  <button type="button" title="Inserir link" onClick={() => { const url = window.prompt("URL do link:"); if (url) formatar("createLink", url); }} className={botaoBarra}><LuLink size={16} /></button>
                </div>
                <div ref={conteudoRef} contentEditable suppressContentEditableWarning onInput={(e) => alterar("conteudo", e.currentTarget.innerHTML)}
                  dangerouslySetInnerHTML={{ __html: form.conteudo }} className="min-h-[200px] bg-white p-4 text-[14px] leading-[1.6] text-[#273449] outline-none [&_a]:text-[#2174b7] [&_a]:underline [&_img]:max-w-full" />
              </div>
            </div>
          </section>

          <aside className={`${cardClass} flex flex-col gap-5 p-6`}>
            <label className={labelClass}>Definições de Status
              <div className={`${fieldClass} bg-white`}>
                <select value={form.status} onChange={(e) => alterar("status", e.target.value)} className={`${inputClass} cursor-pointer`}>
                  <option value="rascunho">Rascunho</option><option value="publicado">Publicado</option><option value="agendado">Agendado</option>
                </select>
              </div>
            </label>
            <label className="flex cursor-pointer items-start justify-between gap-3"><span><strong className="block text-[14px] font-bold">Publicação em Destaque</strong><small className="mt-0.5 block text-[12px] text-[#667b9b]">Colocará o post no banner principal</small></span><input type="checkbox" role="switch" checked={form.destaque} onChange={(e) => alterar("destaque", e.target.checked)} className={`${interruptorBase} checked:border-[#2174b7] checked:before:bg-[#2174b7]`} /></label>
            <label className="flex cursor-pointer items-start justify-between gap-3"><span><strong className="block text-[14px] font-bold">Campanha Urgente</strong><small className="mt-0.5 block text-[12px] text-[#667b9b]">Destacará com visual amarelo no site</small></span><input type="checkbox" role="switch" checked={form.urgente} onChange={(e) => alterar("urgente", e.target.checked)} className={`${interruptorBase} checked:border-[#ffb800] checked:before:bg-[#ffb800]`} /></label>
            <label className={labelClass}>Autor(a)
              <div className={`${fieldClass} bg-white`}>
                <input value={form.autor} onChange={(e) => alterar("autor", e.target.value)} placeholder="Ex.: Mariana Silva" className={inputClass} />
              </div>
            </label>
            <p className="m-0 border-t border-[#e8edf3] pt-4 text-[12px] leading-[1.5] text-[#667b9b]">As alterações ficam no armazenamento temporário do backend até a integração com o banco de dados.</p>
          </aside>
        </div>
      </main>
    </div>
  );
}