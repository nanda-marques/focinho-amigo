import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuFileText,
  LuMegaphone,
  LuCalendar,
  LuHeart,
  LuPlus,
  LuArrowRight,
  LuEye,
  LuPencil,
  LuTrash2,
  LuNewspaper,
} from "react-icons/lu";

import { publicacoesApi } from "../../../services/publicacoesApi";

function formatarData(data) {
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

function normalizarCategoria(categoria = "") {
  return categoria
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function obterDataPublicacao(publicacao) {
  return (
    publicacao.dataPublicacao ||
    publicacao.data ||
    publicacao.createdAt ||
    null
  );
}

function estaPublicada(publicacao) {
  return (
    publicacao.status === "publicado" 
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [publicacoes, setPublicacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarDashboard() {
    setCarregando(true);
    setErro("");

    try {
      const dados = await publicacoesApi.listarAdmin();

      setPublicacoes(Array.isArray(dados) ? dados : []);
    } catch (e) {
      setErro(
        e.message ||
          "Não foi possível carregar os dados do dashboard. Confira se o backend está em execução."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDashboard();
  }, []);

  /*
   * Estatísticas
   */
  const estatisticas = useMemo(() => {
    const campanhas = publicacoes.filter((p) =>
      normalizarCategoria(p.categoria).includes("campanha")
    );

    const eventos = publicacoes.filter((p) =>
      normalizarCategoria(p.categoria).includes("evento")
    );

    const noticias = publicacoes.filter((p) =>
      normalizarCategoria(p.categoria).includes("noticia")
    );

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const trintaDias = new Date(hoje);
    trintaDias.setDate(trintaDias.getDate() + 30);

    const eventosProximos = eventos.filter((p) => {
      const data = obterDataPublicacao(p);

      if (!data) return false;

      const dataEvento = new Date(`${data}T12:00:00`);

      return dataEvento >= hoje && dataEvento <= trintaDias;
    });

    return {
      total: publicacoes.length,

      campanhasAtivas: campanhas.filter((p) =>
        estaPublicada(p)
      ).length,

      eventosProximos: eventosProximos.length,

      noticiasRecentes: noticias.length,
    };
  }, [publicacoes]);

  /*
   * Publicações recentes
   */
  const publicacoesRecentes = useMemo(() => {
    return [...publicacoes]
      .sort((a, b) => {
        const dataA = new Date(
          `${obterDataPublicacao(a) || "1900-01-01"}T12:00:00`
        );

        const dataB = new Date(
          `${obterDataPublicacao(b) || "1900-01-01"}T12:00:00`
        );

        return dataB - dataA;
      })
      .slice(0, 5);
  }, [publicacoes]);

  /*
   * Categorias
   */
  const categorias = useMemo(() => {
    const configuracao = [
      {
        nome: "Campanhas",
        chave: "campanha",
        cor: "bg-[#1976bd]",
      },
      {
        nome: "Animais",
        chave: "animal",
        cor: "bg-[#ff7a18]",
      },
      {
        nome: "Notícias",
        chave: "noticia",
        cor: "bg-[#4285f4]",
      },
      {
        nome: "Eventos",
        chave: "evento",
        cor: "bg-[#00a878]",
      },
      {
        nome: "Projetos",
        chave: "projeto",
        cor: "bg-[#8657e8]",
      },
    ];

    return configuracao.map((categoria) => {
      const quantidade = publicacoes.filter((p) =>
        normalizarCategoria(p.categoria).includes(categoria.chave)
      ).length;

      return {
        ...categoria,
        quantidade,
      };
    });
  }, [publicacoes]);

  const maiorQuantidade = Math.max(
    ...categorias.map((categoria) => categoria.quantidade),
    1
  );

  /*
   * Excluir publicação
   */
  async function excluirPublicacao(publicacao) {
    const confirmou = window.confirm(
      `Deseja excluir "${publicacao.titulo}"?`
    );

    if (!confirmou) return;

    try {
      await publicacoesApi.excluir(publicacao.id);
      await carregarDashboard();
    } catch (e) {
      setErro(
        e.message || "Não foi possível excluir a publicação."
      );
    }
  }

  function classeStatus(status) {
    if (status === "publicado") {
      return "bg-emerald-50 text-emerald-600";
    }

    if (status === "agendado") {
      return "bg-blue-50 text-blue-600";
    }

    return "bg-slate-100 text-slate-500";
  }

  function textoStatus(status) {
    const statusMap = {
      publicado: "Publicado",
      agendado: "Agendado",
      rascunho: "Rascunho",
    };

    return statusMap[status] || status || "—";
  }

  /*
   * Card de estatística
   */
  function CardEstatistica({
    icone: Icone,
    valor,
    titulo,
    descricao,
    tipo,
  }) {
    const estilos = {
      azul: {
        fundo: "bg-blue-50",
        icone: "text-[#1976bd]",
      },
      amarelo: {
        fundo: "bg-amber-50",
        icone: "text-[#ffb700]",
      },
      verde: {
        fundo: "bg-emerald-50",
        icone: "text-emerald-500",
      },
      roxo: {
        fundo: "bg-purple-50",
        icone: "text-purple-500",
      },
    };

    const estilo = estilos[tipo];

    return (
      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-4">
          <div
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${estilo.fundo}`}
          >
            <Icone className={`h-6 w-6 ${estilo.icone}`} />
          </div>

          <div className="min-w-0">
            <p className="text-3xl font-extrabold leading-none text-[#202b40]">
              {carregando ? "—" : valor}
            </p>

            <p className="mt-2 text-sm font-bold text-[#61718f]">
              {titulo}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {descricao}
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f6f6] font-['Inter',Arial,sans-serif] text-[#202b40]">
      {/* Header */}
      <header className="flex min-h-[76px] items-center justify-between border-b border-slate-200 bg-white px-6 py-4 md:px-8">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Dashboard
        </h1>

        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-slate-200 text-sm font-bold text-slate-600">
            MS
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-bold">
              Mariana Silva
            </p>

            <p className="text-xs text-slate-500">
              Gestora de Projetos
            </p>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="px-5 py-8 md:px-8">
        {erro && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {erro}
          </div>
        )}

        {/* Cards superiores */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <CardEstatistica
            icone={LuFileText}
            valor={estatisticas.total}
            titulo="Total Publicações"
            descricao="+4% este mês"
            tipo="azul"
          />

          <CardEstatistica
            icone={LuMegaphone}
            valor={estatisticas.campanhasAtivas}
            titulo="Campanhas Ativas"
            descricao="Arrecadações em andamento"
            tipo="amarelo"
          />

          <CardEstatistica
            icone={LuCalendar}
            valor={estatisticas.eventosProximos}
            titulo="Eventos Próximos"
            descricao="Próximos 30 dias"
            tipo="verde"
          />

          <CardEstatistica
            icone={LuNewspaper}
            valor={estatisticas.noticiasRecentes}
            titulo="Notícias Recentes"
            descricao="Publicações de notícias"
            tipo="roxo"
          />
        </section>

        {/* Ações rápidas */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-extrabold">
            Ações Rápidas
          </h2>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Nova publicação */}
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-extrabold">
                Nova Publicação
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Crie campanhas ou notícias para o portal 
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/publicacoes/nova")
                }
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#1976bd] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#125f9b]"
              >
                <LuPlus size={16} />
                Criar Artigo
              </button>
            </article>

            {/* Animais */}
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-extrabold">
                Gerenciar Animais
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Veja, adicione ou edite os animais da ONG  
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/animais")
                }
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#ffb700] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#e5a500]"
              >
                Ir para Animais
                <LuArrowRight size={15} />
              </button>
            </article>

            {/* Publicações */}
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-extrabold">
                Ver Publicações
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Edite, remova ou agende suas postagens
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/publicacoes")
                }
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-[#202b40] transition hover:bg-slate-200"
              >
                Acessar Lista
                <LuArrowRight size={15} />
              </button>
            </article>
          </div>
        </section>

        {/* Parte inferior */}
        <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,0.8fr)]">
          {/* Publicações recentes */}
          <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h2 className="text-xl font-extrabold">
                Publicações Recentes
              </h2>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/publicacoes")
                }
                className="text-sm font-bold text-[#1976bd] hover:underline"
              >
                Ver todas
              </button>
            </div>

            {carregando ? (
              <div className="p-12 text-center text-sm text-slate-500">
                Carregando publicações...
              </div>
            ) : publicacoesRecentes.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-bold">
                  Nenhuma publicação encontrada
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Crie sua primeira publicação para começar.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/publicacoes/nova")
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1976bd] px-4 py-2 text-sm font-bold text-white"
                >
                  <LuPlus size={16} />
                  Nova publicação
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500">
                    <tr>
                      <th className="px-5 py-3">
                        Título
                      </th>

                      <th className="px-3 py-3">
                        Categoria
                      </th>

                      <th className="px-3 py-3">
                        Data
                      </th>

                      <th className="px-3 py-3">
                        Status
                      </th>

                      <th className="px-4 py-3 text-center">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {publicacoesRecentes.map((publicacao) => (
                      <tr
                        key={publicacao.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="max-w-[330px] px-5 py-4">
                          <p className="truncate font-bold text-slate-800">
                            {publicacao.titulo || "Sem título"}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-3 py-4 text-slate-600">
                          {publicacao.categoria || "—"}
                        </td>

                        <td className="whitespace-nowrap px-3 py-4 text-slate-500">
                          {formatarData(
                            obterDataPublicacao(publicacao)
                          )}
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={`whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-bold ${classeStatus(
                              publicacao.status
                            )}`}
                          >
                            {textoStatus(publicacao.status)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1 text-slate-500">
                            <button
                              type="button"
                              title="Pré-visualizar"
                              onClick={() =>
                                navigate(
                                  `/admin/publicacoes/${publicacao.id}/preview`
                                )
                              }
                              className="rounded-md p-1.5 transition hover:bg-slate-100 hover:text-[#1976bd]"
                            >
                              <LuEye size={17} />
                            </button>

                            <button
                              type="button"
                              title="Editar"
                              onClick={() =>
                                navigate(
                                  `/admin/publicacoes/${publicacao.id}/editar`
                                )
                              }
                              className="rounded-md p-1.5 transition hover:bg-slate-100 hover:text-[#1976bd]"
                            >
                              <LuPencil size={17} />
                            </button>

                            <button
                              type="button"
                              title="Excluir"
                              onClick={() =>
                                excluirPublicacao(publicacao)
                              }
                              className="rounded-md p-1.5 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <LuTrash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          {/* Categorias */}
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold">
              Postagens por Categoria
            </h2>

            <div className="mt-6 space-y-5">
              {categorias.map((categoria) => {
                const porcentagem =
                  categoria.quantidade === 0
                    ? 0
                    : Math.max(
                        8,
                        (categoria.quantidade /
                          maiorQuantidade) *
                          100
                      );

                return (
                  <div key={categoria.nome}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-bold text-[#202b40]">
                        {categoria.nome}
                      </span>

                      <span className="text-xs text-slate-500">
                        {categoria.quantidade}{" "}
                        {categoria.quantidade === 1
                          ? "post"
                          : "posts"}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${categoria.cor} transition-all duration-500`}
                        style={{
                          width: `${porcentagem}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}