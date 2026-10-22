import { useCallback, useEffect, useMemo, useState } from "react";
import type { JSX } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuPlus,
  LuSearch,
  LuEye,
  LuPencil,
  LuTrash2,
  LuStar,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuCirclePause,
  LuSend,
} from "react-icons/lu";

import { publicacoesApi } from "../../../services/publicacoesApi";
import type {
  Publicacao,
  StatusPublicacao,
} from "../../../services/publicacoesApi";

type Id = Publicacao["id"];
type AcaoEmLote = "excluir" | "publicar";

function mensagem(e: unknown): string {
  return e instanceof Error ? e.message : "";
}

const POR_PAGINA = 8;

const statusTexto: Record<StatusPublicacao, string> = {
  publicado: "Publicado",
  agendado: "Agendado",
  rascunho: "Rascunho",
  arquivado: "Arquivado",
};

const statusClasse: Record<StatusPublicacao, string> = {
  publicado: "bg-[#e3f8ef] text-[#10b981]",
  agendado: "bg-[#e5eefd] text-[#3b82f6]",
  rascunho: "bg-[#ebeef2] text-[#667b9b]",
  arquivado: "bg-[#ebeef2] text-[#667b9b]",
};

function formatarData(data?: string): string {
  if (!data) return "—";
  const d = new Date(`${data}T12:00:00`);
  if (Number.isNaN(d.getTime())) return data;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(d)
    .replace(".", "");
}

/* ---------- Estilos ---------- */
const cardClass =
  "rounded-[12px] border border-[#e2e2e2] bg-white shadow-[0_2px_3px_rgb(0_0_0/12%)]";
const selectClass =
  "h-[38px] cursor-pointer rounded-[8px] border border-[#dce5ef] bg-white px-3 text-[13.5px] text-[#273449] outline-none focus:border-[#2174b7] focus:ring-4 focus:ring-[#2174b7]/10";
const iconBtn =
  "flex cursor-pointer border-0 bg-transparent p-0 transition-colors";

export default function Publications(): JSX.Element {
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [status, setStatus] = useState("todos");
  const [selecionados, setSelecionados] = useState<Id[]>([]);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const carregar = useCallback(async (): Promise<void> => {
    setCarregando(true);
    setErro("");
    try {
      const dados = await publicacoesApi.listarAdmin();
      setPublicacoes(Array.isArray(dados) ? dados : []);
    } catch (e: unknown) {
      setErro(
        mensagem(e) ||
          "Não foi possível carregar as publicações. Confira se o backend está em execução."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const categorias = useMemo(
    () =>
      [...new Set(publicacoes.map((p) => p.categoria).filter(Boolean))].sort(),
    [publicacoes]
  );

  const filtradas = useMemo(
    () =>
      publicacoes.filter((p) => {
        const termo = busca.trim().toLocaleLowerCase("pt-BR");
        const alvo =
          `${p.titulo ?? ""} ${p.autor ?? ""}`.toLocaleLowerCase("pt-BR");
        const correspondeBusca = !termo || alvo.includes(termo);
        const correspondeCategoria =
          categoria === "todas" || p.categoria === categoria;
        const correspondeStatus = status === "todos" || p.status === status;
        return correspondeBusca && correspondeCategoria && correspondeStatus;
      }),
    [publicacoes, busca, categoria, status]
  );

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const itensPagina = filtradas.slice(
    (paginaAtual - 1) * POR_PAGINA,
    paginaAtual * POR_PAGINA
  );
  const todosDaPaginaSelecionados =
    itensPagina.length > 0 &&
    itensPagina.every((p) => selecionados.includes(p.id));

  function alternarSelecao(id: Id): void {
    setSelecionados((atual) =>
      atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]
    );
  }

  function selecionarPagina(): void {
    setSelecionados((atual) =>
      todosDaPaginaSelecionados
        ? atual.filter((id) => !itensPagina.some((p) => p.id === id))
        : [...new Set([...atual, ...itensPagina.map((p) => p.id)])]
    );
  }

  async function acaoEmLote(acao: AcaoEmLote): Promise<void> {
    if (!selecionados.length) return;
    if (
      acao === "excluir" &&
      !window.confirm(
        `Excluir ${selecionados.length} publicação(ões) selecionada(s)?`
      )
    ) {
      return;
    }
    setErro("");
    try {
      await Promise.all(
        selecionados.map(async (id) => {
          const p = publicacoes.find((item) => item.id === id);
          if (!p) return;
          if (acao === "excluir") return publicacoesApi.excluir(id);
          return publicacoesApi.salvar({ ...p, status: "publicado" });
        })
      );
      setSelecionados([]);
      await carregar();
    } catch (e: unknown) {
      setErro(
        mensagem(e) || "Não foi possível concluir a ação em lote."
      );
    }
  }

  async function alternarStatus(p: Publicacao): Promise<void> {
    const novoStatus: StatusPublicacao =
      p.status === "publicado" ? "rascunho" : "publicado";
    try {
      await publicacoesApi.salvar({ ...p, status: novoStatus });
      await carregar();
    } catch (e: unknown) {
      setErro(mensagem(e) || "Não foi possível alterar o status.");
    }
  }

  async function alternarDestaque(p: Publicacao): Promise<void> {
    try {
      await publicacoesApi.salvar({ ...p, destaque: !p.destaque });
      await carregar();
    } catch (e: unknown) {
      setErro(mensagem(e) || "Não foi possível alterar o destaque.");
    }
  }

  async function excluir(p: Publicacao): Promise<void> {
    if (!window.confirm(`Deseja excluir "${p.titulo}"?`)) return;
    try {
      await publicacoesApi.excluir(p.id);
      setSelecionados((atual) => atual.filter((id) => id !== p.id));
      await carregar();
    } catch (e: unknown) {
      setErro(mensagem(e) || "Não foi possível excluir a publicação.");
    }
  }

  return (
    <div className="box-border flex min-h-screen min-w-0 flex-1 flex-col bg-[#f0f0f0] font-['Inter',Arial,sans-serif] text-[#202b3e] *:box-border">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-[#e2e2e2] bg-white py-4 pl-[72px] pr-5 sm:pr-8 lg:px-8 lg:py-5">
        <h1 className="m-0 text-[22px] font-extrabold leading-[1.2] tracking-[-0.5px] sm:text-[26px]">
          Gerenciar Publicações
        </h1>
        <div className="flex items-center gap-3">
          <div className="grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[#e8f3fd] text-[13px] font-bold text-[#0874ca]">
            <span>MS</span>
          </div>
          <div className="hidden text-right leading-tight sm:block">
            <p className="m-0 text-[14px] font-bold">Mariana Silva</p>
            <p className="m-0 text-[12.5px] text-[#667b9b]">
              Gestora de Projetos
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-5 p-5 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 text-[15px] text-[#667b9b]">
            Veja e edite todas as postagens publicadas no portal público.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/publicacoes/nova")}
            className="flex h-[40px] cursor-pointer items-center gap-2 rounded-[8px] border-0 bg-[#2174b7] px-5 text-[13.5px] font-bold text-white shadow-[0_2px_3px_rgb(0_0_0/22%)] transition-colors duration-150 hover:bg-[#1767a8]"
          >
            <LuPlus size={18} /> Nova Publicação
          </button>
        </div>

        {erro && (
          <div
            role="alert"
            className="rounded-[8px] border border-[#f9c4be] bg-[#fff1f0] px-3.5 py-2.5 text-[13px] font-semibold text-[#b42318]"
          >
            {erro}
          </div>
        )}

        <section className={`${cardClass} flex flex-wrap items-center gap-3 p-3.5`}>
          <label className="relative flex h-[38px] min-w-[220px] flex-1 items-center rounded-[8px] border border-[#dce5ef] bg-[#f7f9fb] focus-within:border-[#2174b7] focus-within:ring-4 focus-within:ring-[#2174b7]/10">
            <LuSearch
              className="absolute left-[12px] text-[#687d9a]"
              size={17}
            />
            <input
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPagina(1);
              }}
              placeholder="Buscar por título..."
              aria-label="Buscar por título"
              className="w-full min-w-0 border-0 bg-transparent py-0 pl-10 pr-3 text-[13.5px] text-[#273449] outline-none placeholder:text-[#8a9ab2]"
            />
          </label>
          <select
            aria-label="Filtrar por categoria"
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value);
              setPagina(1);
            }}
            className={selectClass}
          >
            <option value="todas">Categoria: Todas</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                Categoria: {c}
              </option>
            ))}
          </select>
          <select
            aria-label="Filtrar por status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPagina(1);
            }}
            className={selectClass}
          >
            <option value="todos">Status: Todos</option>
            <option value="publicado">Status: Publicado</option>
            <option value="agendado">Status: Agendado</option>
            <option value="rascunho">Status: Rascunho</option>
            <option value="arquivado">Status: Arquivado</option>
          </select>
        </section>

        <section className={`${cardClass} overflow-hidden`}>
          {carregando ? (
            <p className="m-0 p-12 text-center text-[14px] text-[#667b9b]">
              Carregando publicações...
            </p>
          ) : itensPagina.length === 0 ? (
            <div className="p-12 text-center">
              <p className="m-0 font-bold">Nenhuma publicação encontrada</p>
              <p className="m-0 mt-2 text-[13.5px] text-[#667b9b]">
                Tente alterar os filtros ou clique em “Nova Publicação”.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] border-collapse text-left text-[13.5px]">
                <thead className="bg-[#f7f9fb] text-[12px] font-bold text-[#667b9b]">
                  <tr>
                    <th className="w-10 py-3.5 pl-4 pr-2">
                      <input
                        type="checkbox"
                        aria-label="Selecionar publicações desta página"
                        checked={todosDaPaginaSelecionados}
                        onChange={selecionarPagina}
                        className="h-[16px] w-[16px] cursor-pointer accent-[#2174b7]"
                      />
                    </th>
                    <th className="px-2 py-3.5">Img</th>
                    <th className="px-2 py-3.5">Título</th>
                    <th className="px-2 py-3.5">Categoria</th>
                    <th className="px-2 py-3.5">Data</th>
                    <th className="px-2 py-3.5">Status</th>
                    <th className="px-2 py-3.5 text-center">Destaque</th>
                    <th className="px-2 py-3.5 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {itensPagina.map((p) => {
                    const st: StatusPublicacao = p.status ?? "rascunho";
                    return (
                      <tr
                        key={p.id}
                        className={`border-t border-[#e8edf3] transition hover:bg-[#f7f9fb] ${
                          p.destaque ? "bg-[#fffbe8]" : "bg-white"
                        }`}
                      >
                        <td className="py-3 pl-4 pr-2">
                          <input
                            type="checkbox"
                            aria-label={`Selecionar ${p.titulo}`}
                            checked={selecionados.includes(p.id)}
                            onChange={() => alternarSelecao(p.id)}
                            className="h-[16px] w-[16px] cursor-pointer accent-[#2174b7]"
                          />
                        </td>
                        <td className="px-2 py-2.5">
                          {p.imagem ? (
                            <img
                              src={p.imagem}
                              alt=""
                              className="h-[40px] w-[40px] rounded-[6px] object-cover"
                            />
                          ) : (
                            <div className="h-[40px] w-[40px] rounded-[6px] bg-[#eef2f6]" />
                          )}
                        </td>
                        <td className="max-w-[300px] px-2 py-3 font-bold">
                          {p.titulo}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-[#3d4b63]">
                          {p.categoria ?? "—"}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-[#667b9b]">
                          {formatarData(p.dataPublicacao)}
                        </td>
                        <td className="px-2 py-3">
                          <span
                            className={`inline-block whitespace-nowrap rounded-[4px] px-2 py-0.5 text-[11.5px] font-bold ${statusClasse[st]}`}
                          >
                            {statusTexto[st]}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <button
                            type="button"
                            title={
                              p.destaque
                                ? "Remover destaque"
                                : "Marcar como destaque"
                            }
                            onClick={() => alternarDestaque(p)}
                            className={`${iconBtn} mx-auto ${
                              p.destaque
                                ? "text-destaque"
                                : "text-[#c3cedc] hover:text-destaque"
                            }`}
                          >
                            <LuStar
                              size={18}
                              fill={p.destaque ? "currentColor" : "none"}
                            />
                          </button>
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex items-center justify-center gap-2.5 text-[#687d9a]">
                            <button
                              type="button"
                              title="Pré-visualizar"
                              onClick={() =>
                                navigate(
                                  `/admin/publicacoes/${p.id}/preview`
                                )
                              }
                              className={`${iconBtn} hover:text-[#2174b7]`}
                            >
                              <LuEye size={17} />
                            </button>
                            <button
                              type="button"
                              title="Editar"
                              onClick={() =>
                                navigate(
                                  `/admin/publicacoes/${p.id}/editar`
                                )
                              }
                              className={`${iconBtn} hover:text-[#2174b7]`}
                            >
                              <LuPencil size={17} />
                            </button>
                            <button
                              type="button"
                              title={
                                p.status === "publicado"
                                  ? "Retirar do ar"
                                  : "Publicar"
                              }
                              onClick={() => alternarStatus(p)}
                              className={`${iconBtn} text-[#10b981]`}
                            >
                              {p.status === "publicado" ? (
                                <LuCirclePause size={17} />
                              ) : (
                                <LuCircleCheck size={17} />
                              )}
                            </button>
                            <button
                              type="button"
                              title="Excluir"
                              onClick={() => excluir(p)}
                              className={`${iconBtn} hover:text-[#c0392b]`}
                            >
                              <LuTrash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!selecionados.length}
              onClick={() => acaoEmLote("excluir")}
              className="h-[36px] cursor-pointer rounded-[8px] border border-[#f04438] bg-[#fff5f5] px-3.5 text-[13px] font-bold text-[#d92d20] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              Excluir Selecionados
            </button>
            <button
              type="button"
              disabled={!selecionados.length}
              onClick={() => acaoEmLote("publicar")}
              className="flex h-[36px] cursor-pointer items-center gap-1.5 rounded-[8px] border border-[#2174b7] bg-[#e8f3fd] px-3.5 text-[13px] font-bold text-[#14598d] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LuSend size={13} />
              Publicar Selecionados
            </button>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#667b9b]">
            <span className="mr-1">
              Página {paginaAtual} de {totalPaginas}
            </span>
            <button
              type="button"
              aria-label="Página anterior"
              disabled={paginaAtual <= 1}
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              className="grid h-[30px] w-[30px] cursor-pointer place-items-center rounded-[6px] border border-[#dce5ef] bg-white text-[#273449] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LuChevronLeft size={16} />
            </button>
            <span className="grid h-[30px] min-w-[30px] place-items-center rounded-[6px] bg-[#2174b7] px-1.5 text-[13px] font-bold text-white">
              {paginaAtual}
            </span>
            <button
              type="button"
              aria-label="Próxima página"
              disabled={paginaAtual >= totalPaginas}
              onClick={() =>
                setPagina((p) => Math.min(totalPaginas, p + 1))
              }
              className="grid h-[30px] w-[30px] cursor-pointer place-items-center rounded-[6px] border border-[#dce5ef] bg-white text-[#273449] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LuChevronRight size={16} />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}