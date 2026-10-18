import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; 
import { LuMonitor, LuSmartphone, LuCheck } from "react-icons/lu";
import { publicacoesApi } from "../../../services/publicacoesApi";
import logoImg from "../../../assets/logo.svg"; 

export default function PublicationPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const [erro, setErro] = useState("");
  const [mobile, setMobile] = useState(false);

  useEffect(() => { publicacoesApi.buscar(id).then(setP).catch((e) => setErro(e.message)); }, [id]);
async function publicar() {
    try { 
      await publicacoesApi.salvar({ ...p, status: "publicado" }); 
      navigate("/admin/publicacoes"); 
    }
    catch (e) { setErro(e.message); }
  }

  if (erro) return <main className="p-8"><p role="alert" className="text-red-700">{erro}</p><Link to="/admin/publicacoes">Voltar às publicações</Link></main>;
  if (!p) return <main className="p-8 text-slate-500">Carregando pré-visualização...</main>;

  return (
    <main className="min-h-screen bg-[#f0f0f0]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5">
        <div className="flex items-center gap-4"><h1 className="text-2xl font-extrabold text-[#202b40]">Pré-visualização</h1>
          <div className="flex rounded-lg bg-slate-100 p-1"><button title="Desktop" onClick={() => setMobile(false)} className={`rounded p-2 ${!mobile ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}><LuMonitor /></button><button title="Celular" onClick={() => setMobile(true)} className={`rounded p-2 ${mobile ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}><LuSmartphone /></button></div>
        </div>
        <div className="flex gap-3"><Link to={`/admin/publicacoes/${id}/editar`} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-600">Voltar para Edição</Link><button onClick={publicar} className="rounded-lg bg-[#ffb800] px-5 py-2.5 text-sm font-bold text-white">Publicar Agora</button></div>
      </header>
      <div className="grid items-start gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_282px]">
        <section className={`mx-auto min-h-[760px] overflow-hidden rounded-xl border-2 border-slate-300 bg-white shadow-md ${mobile ? "w-[390px] max-w-full" : "w-full"}`}>
          <div className="flex items-center gap-2 border-b bg-slate-100 px-4 py-2"><i className="h-2.5 w-2.5 rounded-full bg-red-500"/><i className="h-2.5 w-2.5 rounded-full bg-amber-500"/><i className="h-2.5 w-2.5 rounded-full bg-emerald-500"/><div className="ml-2 truncate rounded-md bg-white px-4 py-1 text-xs text-slate-500">focinho-amigo.org.br/{p.categoria.toLowerCase().replaceAll(" ", "-")}</div></div>
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5"><img src={logoImg} alt="Logo Focinho Amigo" className="h-10 w-10 object-contain"/><div><strong className="text-lg text-[#2174b7]">Focinho Amigo</strong><p className="text-[10px] font-semibold text-amber-500">NOS AJUDE A SALVAR VIDAS.</p></div><nav className="ml-auto hidden gap-4 text-xs font-semibold text-slate-700 md:flex"><span>Início</span><span>Sobre Nós</span><span>Eventos</span><span>Adoção</span></nav></div>
          <article className={`m-5 rounded-[30px] border-2 p-6 md:m-8 md:p-9 ${p.urgente ? "border-amber-400 bg-amber-50" : "border-slate-100 bg-white"}`}>
            {p.urgente && <span className="mb-5 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase text-amber-700">Campanha urgente</span>}
            {p.destaque && <span className="mb-3 ml-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Em destaque</span>}
            {p.imagem && <img src={p.imagem} alt="" className="mb-6 max-h-[360px] w-full rounded-2xl object-cover" />}
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">{p.categoria} {p.dataPublicacao ? `• ${p.dataPublicacao}` : ""}</p>
            <h2 className="mb-4 text-3xl font-extrabold leading-tight text-[#242424]">{p.titulo}</h2>
            {p.descricao && <p className="mb-5 text-lg leading-7 text-slate-600">{p.descricao}</p>}
            <div className="prose max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: p.conteudo || "" }} />
            {p.categoria.toLowerCase().includes("campanha") && <button className="mt-6 rounded-xl bg-[#2174b7] px-6 py-3 font-bold text-white">Contribuir Agora</button>}
          </article>
        </section>
        <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-extrabold text-[#202b40]">Detalhes da Publicação</h2>
          <dl className="space-y-4 text-sm"><div className="flex justify-between gap-3"><dt className="text-slate-500">Status</dt><dd className="text-right font-bold">{p.status === "publicado" ? "Publicado" : p.status === "arquivado" ? "Arquivado" : "Rascunho"}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Categoria</dt><dd className="text-right font-bold">{p.categoria}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Data de Lançamento</dt><dd className="text-right font-bold">{p.dataPublicacao || "Não definida"}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Autor</dt><dd className="text-right font-bold">{p.autor || "Não informado"}</dd></div></dl>
          <hr className="my-5" /><h3 className="mb-3 font-bold text-[#202b40]">Checklist de Validação</h3>
          {[["Título preenchido", !!p.titulo.trim()], ["Imagem destacada carregada", !!p.imagem], ["Conteúdo principal", !!p.conteudo.trim()], ["Categoria selecionada", !!p.categoria]].map(([texto, ok]) => <p key={texto} className="mb-2 flex items-center gap-2 text-sm"><LuCheck className={ok ? "text-emerald-500" : "text-slate-300"} />{texto}</p>)}
        </aside>
      </div>
    </main>
  );
}
