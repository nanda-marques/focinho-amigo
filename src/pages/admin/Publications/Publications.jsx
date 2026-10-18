import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuPlus, LuSearch, LuEye, LuPencil, LuTrash2, LuStar, LuChevronLeft,
  LuChevronRight, LuCircleCheck, LuCirclePause, LuSend,
} from "react-icons/lu";
import { publicacoesApi } from "../../../services/publicacoesApi";

const POR_PAGINA = 8;
const statusTexto = {
  publicado: "Publicado",
  rascunho: "Rascunho",
  agendado: "Agendado"
};

function formatarData(data) {
  if (!data) return "—";
  const d = new Date(`${data}T12:00:00`);
  if (Number.isNaN(d.getTime())) return data;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(d).replace(".", "");
}

export default function Publications() {
  const [publicacoes, setPublicacoes] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [status, setStatus] = useState("todos");
  const [selecionados, setSelecionados] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const dados = await publicacoesApi.listarAdmin();
      setPublicacoes(Array.isArray(dados) ? dados : []);
    } catch (e) {
      setErro(e.message || "Não foi possível carregar as publicações. Confira se o backend está em execução.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  const categorias = useMemo(
    () => [...new Set(publicacoes.map((p) => p.categoria).filter(Boolean))].sort(),
    [publicacoes],
  );

  const filtradas = useMemo(() => publicacoes.filter((p) => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    const correspondeBusca = !termo || `${p.titulo || ""} ${p.autor || ""}`.toLocaleLowerCase("pt-BR").includes(termo);
    const correspondeCategoria = categoria === "todas" || p.categoria === categoria;
    const correspondeStatus = status === "todos" || p.status === status;
    return correspondeBusca && correspondeCategoria && correspondeStatus;
  }), [publicacoes, busca, categoria, status]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const itensPagina = filtradas.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);
  const todosDaPaginaSelecionados = itensPagina.length > 0 && itensPagina.every((p) => selecionados.includes(p.id));

  function alternarSelecao(id) {
    setSelecionados((atual) => atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]);
  }

  function selecionarPagina() {
    setSelecionados((atual) => todosDaPaginaSelecionados
      ? atual.filter((id) => !itensPagina.some((p) => p.id === id))
      : [...new Set([...atual, ...itensPagina.map((p) => p.id)])]);
  }

  async function acaoEmLote(acao) {
    if (!selecionados.length) return;
    if (acao === "excluir" && !window.confirm(`Excluir ${selecionados.length} publicação(ões) selecionada(s)?`)) return;
    setErro("");
    try {
      await Promise.all(selecionados.map(async (id) => {
        const p = publicacoes.find((item) => item.id === id);
        if (!p) return;
        if (acao === "excluir") return publicacoesApi.excluir(id);
        return publicacoesApi.salvar({ ...p, status: "publicado" });
      }));
      setSelecionados([]);
      await carregar();
    } catch (e) {
      setErro(e.message || "Não foi possível concluir a ação em lote.");
    }
  }

  async function alternarStatus(p) {
    const novoStatus = p.status === "publicado" ? "rascunho" : "publicado";
    try {
      await publicacoesApi.salvar({ ...p, status: novoStatus });
      await carregar();
    } catch (e) {
      setErro(e.message || "Não foi possível alterar o status.");
    }
  }

  async function excluir(p) {
    if (!window.confirm(`Deseja excluir "${p.titulo}"?`)) return;
    try {
      await publicacoesApi.excluir(p.id);
      setSelecionados((atual) => atual.filter((id) => id !== p.id));
      await carregar();
    } catch (e) {
      setErro(e.message || "Não foi possível excluir a publicação.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f9fc] text-[#202b40]">
      <header className="flex min-h-[76px] items-center justify-between border-b border-slate-200 bg-white px-6 py-4 md:px-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Gerenciar Publicações</h1>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-slate-200 text-sm font-bold text-slate-600">
            <span>MS</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold">Mariana Silva</p>
            <p className="text-xs text-slate-500">Gestora de Projetos</p>
          </div>
        </div>
      </header>

      <div className="px-5 py-8 md:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-base text-slate-500">Veja e edite todas as postagens publicadas no portal público.</p>
          <button onClick={() => navigate("/admin/publicacoes/nova")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1976bd] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#125f9b]">
            <LuPlus size={17} /> Nova Publicação
          </button>
        </div>

        {erro && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{erro}</div>}

        <section className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="relative w-full sm:max-w-xs">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
            <input value={busca} onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
              placeholder="Buscar por título..." aria-label="Buscar por título"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white" />
          </label>
          <select aria-label="Filtrar por categoria" value={categoria} onChange={(e) => { setCategoria(e.target.value); setPagina(1); }}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
            <option value="todas">Categoria: Todas</option>
            {categorias.map((c) => <option key={c} value={c}>Categoria: {c}</option>)}
          </select>
          <select aria-label="Filtrar por status" value={status} onChange={(e) => { setStatus(e.target.value); setPagina(1); }}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
            <option value="todos">Status: Todos</option>
            <option value="publicado">Status: Publicado</option>
            <option value="agendado">Status: Agendado</option>
            <option value="rascunho">Status: Rascunho</option>
          </select>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {carregando ? <p className="p-12 text-center text-sm text-slate-500">Carregando publicações...</p>
            : itensPagina.length === 0 ? (
              <div className="p-14 text-center">
                <p className="font-bold">Nenhuma publicação encontrada</p>
                <p className="mt-2 text-sm text-slate-500">Tente alterar os filtros ou clique em “Nova Publicação”.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] border-collapse text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500">
                    <tr>
                      <th className="w-10 px-4 py-3"><input type="checkbox" aria-label="Selecionar publicações desta página" checked={todosDaPaginaSelecionados} onChange={selecionarPagina} /></th>
                      <th className="px-2 py-3">Img</th><th className="px-3 py-3">Título</th><th className="px-3 py-3">Categoria</th><th className="px-3 py-3">Data</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-center">Destaque</th><th className="px-3 py-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {itensPagina.map((p) => (
                      <tr key={p.id} className={`transition hover:bg-slate-50 ${p.destaque ? "bg-amber-50/70" : "bg-white"}`}>
                        <td className="px-4 py-3"><input type="checkbox" aria-label={`Selecionar ${p.titulo}`} checked={selecionados.includes(p.id)} onChange={() => alternarSelecao(p.id)} /></td>
                        <td className="px-2 py-2">
                          {p.imagem ? <img src={p.imagem} alt="" className="h-11 w-11 rounded-lg object-cover" /> : <div className="h-11 w-11 rounded-lg bg-slate-100" />}
                        </td>
                        <td className="max-w-[300px] px-3 py-3 font-bold text-slate-800">{p.titulo}</td>
                        <td className="whitespace-nowrap px-3 py-3">{p.categoria}</td>
                        <td className="whitespace-nowrap px-3 py-3 text-slate-500">{formatarData(p.dataPublicacao)}</td>
                        <td className="px-3 py-3"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${p.status === "publicado" ? "bg-emerald-50 text-emerald-600" : p.status === "agendado" ? "bg-blue-50 text-blue-600" : p.status === "arquivado" ? "bg-slate-100 text-slate-500" : "bg-slate-100 text-slate-500"}`}>{statusTexto[p.status] || p.status}</span></td>
                        <td className="px-3 py-3 text-center"><button title={p.destaque ? "Remover destaque" : "Marcar como destaque"} onClick={() => publicacoesApi.salvar({ ...p, destaque: !p.destaque }).then(carregar).catch((e) => setErro(e.message))} className={`rounded p-1 ${p.destaque ? "text-amber-500" : "text-slate-300 hover:text-amber-500"}`}><LuStar size={19} fill={p.destaque ? "currentColor" : "none"} /></button></td>
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-2 text-slate-500">
                            <button title="Pré-visualizar" onClick={() => navigate(`/admin/publicacoes/${p.id}/preview`)} className="rounded p-1 hover:bg-slate-100 hover:text-blue-600"><LuEye size={18} /></button>
                            <button title="Editar" onClick={() => navigate(`/admin/publicacoes/${p.id}/editar`)} className="rounded p-1 hover:bg-slate-100 hover:text-blue-600"><LuPencil size={17} /></button>
                            <button title={p.status === "publicado" ? "Retirar do ar" : "Publicar"} onClick={() => alternarStatus(p)} className="rounded p-1 text-emerald-500 hover:bg-emerald-50">{p.status === "publicado" ? <LuCirclePause size={17} /> : <LuCircleCheck size={17} />}</button>
                            <button title="Excluir" onClick={() => excluir(p)} className="rounded p-1 hover:bg-red-50 hover:text-red-600"><LuTrash2 size={17} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </section>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-3">
          <div className="flex flex-wrap gap-3">
            <button disabled={!selecionados.length} onClick={() => acaoEmLote("excluir")} className="rounded-lg border border-red-400 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 disabled:cursor-not-allowed disabled:opacity-40">Excluir Selecionados</button>
            <button disabled={!selecionados.length} onClick={() => acaoEmLote("publicar")} className="rounded-lg border border-blue-500 bg-sky-50 px-4 py-2 text-xs font-bold text-sky-800 disabled:cursor-not-allowed disabled:opacity-40"><LuSend className="mr-1 inline" size={13} />Publicar Selecionados</button>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Página {paginaAtual} de {totalPaginas}</span>
            <button aria-label="Página anterior" disabled={paginaAtual <= 1} onClick={() => setPagina((p) => Math.max(1, p - 1))} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><LuChevronLeft size={16} /></button>
            <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-[#1976bd] px-2 font-bold text-white">{paginaAtual}</span>
            <button aria-label="Próxima página" disabled={paginaAtual >= totalPaginas} onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><LuChevronRight size={16} /></button>
          </div>
        </footer>
      </div>
    </main>
  );
}