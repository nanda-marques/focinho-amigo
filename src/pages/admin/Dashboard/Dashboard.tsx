import { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";
import { useNavigate } from "react-router-dom";
import type { IconType } from "react-icons";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { LuFileText, LuMegaphone, LuCalendar, LuHeart } from "react-icons/lu";

import AdminHeader from "../../../components/layout/adminHeader";
import { publicacoesApi } from "../../../services/publicacoesApi";

interface Publicacao {
  id: number | string;
  titulo?: string;
  categoria?: string;
  status?: string;
  dataPublicacao?: string;
  data?: string;
  createdAt?: string;
}

type StatusPublicacao = "Publicado" | "Agendado" | "Rascunho";

const cardClass =
  "bg-white border border-[#e2e2e2] rounded-[12px] shadow-[0_2px_3px_rgb(0_0_0/22%)]";

const statusClass: Record<StatusPublicacao, string> = {
  Publicado: "text-[#10b981] bg-[#e3f8ef]",
  Agendado: "text-[#3b82f6] bg-[#e5eefd]",
  Rascunho: "text-[#667b9b] bg-[#ebeef2]",
};

const CATEGORIAS = [
  { nome: "Campanhas", cor: "#2174b7" },
  { nome: "Animais", cor: "#ff7a18" },
  { nome: "Notícias", cor: "#4285f4" },
  { nome: "Eventos", cor: "#00a878" },
  { nome: "Projetos", cor: "#8657e8" },
];

/* ------------------------- Helpers ------------------------- */

function normalizar(texto = ""): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function extrairDataISO(p: Publicacao): string {
  const bruta = p.dataPublicacao || p.data || p.createdAt;
  if (!bruta) return "";
  // retorna apenas YYYY-MM-DD quando possível
  if (/^\d{4}-\d{2}-\d{2}/.test(bruta)) return bruta.slice(0, 10);
  const d = new Date(bruta);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function formatarData(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(d)
    .replace(".", "");
}

function hojeISO(): string {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return hoje.toISOString().slice(0, 10);
}

function somarDias(iso: string, dias: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

function normalizarStatus(status?: string): StatusPublicacao {
  const s = normalizar(status);
  if (s === "publicado") return "Publicado";
  if (s === "agendado") return "Agendado";
  return "Rascunho";
}

/* ------------------------- StatCard ------------------------- */

interface StatCardProps {
  icone: IconType;
  valor: number;
  titulo: string;
  descricao: string;
  corIcone: string;
  fundoIcone: string;
}

function StatCard({
  icone: Icone,
  valor,
  titulo,
  descricao,
  corIcone,
  fundoIcone,
}: StatCardProps): JSX.Element {
  return (
    <div className={`${cardClass} flex items-center gap-[16px] p-[22px]`}>
      <span
        className="w-[48px] h-[48px] shrink-0 flex items-center justify-center rounded-full"
        style={{ color: corIcone, backgroundColor: fundoIcone }}
      >
        <Icone className="w-[22px] h-[22px]" />
      </span>
      <div className="min-w-0">
        <strong className="block text-[28px] leading-[1.1] font-extrabold">
          {valor}
        </strong>
        <span className="block mt-[4px] text-[14px] font-semibold text-[#3d4b63]">
          {titulo}
        </span>
        <small className="block mt-[2px] text-[11.5px] text-[#667b9b]">
          {descricao}
        </small>
      </div>
    </div>
  );
}

/* ------------------------- Dashboard ------------------------- */

export default function Dashboard(): JSX.Element {
  const navigate = useNavigate();

  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string>("");

  async function carregar(): Promise<void> {
    setCarregando(true);
    setErro("");
    try {
      const dados = await publicacoesApi.listarAdmin();
      setPublicacoes(Array.isArray(dados) ? dados : []);
    } catch (e: unknown) {
      setErro(
        e instanceof Error
          ? e.message
          : "Não foi possível carregar os dados do dashboard."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const resumo = useMemo(() => {
    const hoje = hojeISO();
    const em30Dias = somarDias(hoje, 30);
    const ha7Dias = somarDias(hoje, -7);

    const publicadas = publicacoes.filter(
      (p) => normalizarStatus(p.status) === "Publicado"
    );

    const eventosProximos = publicacoes.filter((p) => {
      const categoria = normalizar(p.categoria);
      const status = normalizarStatus(p.status);
      const data = extrairDataISO(p);
      return (
        categoria.includes("evento") &&
        status !== "Rascunho" &&
        !!data &&
        data >= hoje &&
        data <= em30Dias
      );
    });

    const noticiasRecentes = publicadas.filter((p) => {
      const categoria = normalizar(p.categoria);
      const data = extrairDataISO(p);
      return categoria.includes("noticia") && !!data && data >= ha7Dias && data <= hoje;
    });

    return {
      totalPublicacoes: publicacoes.length,
      campanhasAtivas: publicadas.filter((p) =>
        normalizar(p.categoria).includes("campanha")
      ).length,
      eventosProximos: eventosProximos.length,
      noticiasRecentes: noticiasRecentes.length,
    };
  }, [publicacoes]);

  const publicacoesRecentes = useMemo(() => {
    return [...publicacoes]
      .sort((a, b) => extrairDataISO(b).localeCompare(extrairDataISO(a)))
      .slice(0, 5);
  }, [publicacoes]);

  const categorias = useMemo(() => {
    return CATEGORIAS.map((c) => ({
      ...c,
      posts: publicacoes.filter((p) =>
        normalizar(p.categoria).includes(normalizar(c.nome).replace(/s$/, ""))
      ).length,
    }));
  }, [publicacoes]);

  const maiorQuantidade = Math.max(...categorias.map((c) => c.posts), 1);

  async function excluirPublicacao(publicacao: Publicacao): Promise<void> {
    if (!window.confirm(`Excluir a publicação "${publicacao.titulo}"?`)) return;
    try {
      await publicacoesApi.excluir(publicacao.id);
      await carregar();
    } catch (e: unknown) {
      setErro(
        e instanceof Error ? e.message : "Não foi possível excluir a publicação."
      );
    }
  }

  function verPublicacao(p: Publicacao): void {
    navigate(`/admin/publicacoes/${p.id}/preview`);
  }

  function editarPublicacao(p: Publicacao): void {
    navigate(`/admin/publicacoes/${p.id}/editar`);
  }

  return (
    <div className="flex-1 min-w-0 min-h-screen flex flex-col font-['Inter',Arial,sans-serif] text-[#202b3e] bg-[#f0f0f0] box-border *:box-border">
      <AdminHeader titulo="Dashboard" />

      <main className="flex-1 flex flex-col gap-[28px] p-[18px] sm:p-[24px] lg:p-[32px]">
        {erro && (
          <div
            role="alert"
            className="rounded-[8px] border border-red-200 bg-red-50 p-[12px] text-[13px] text-red-700"
          >
            {erro}
          </div>
        )}

        {/* Cards de resumo */}
        <section
          aria-label="Resumo"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[16px]"
        >
          <StatCard
            icone={LuFileText}
            valor={carregando ? 0 : resumo.totalPublicacoes}
            titulo="Total Publicações"
            descricao="Total cadastrado"
            corIcone="#2174b7"
            fundoIcone="#e8f3fd"
          />
          <StatCard
            icone={LuMegaphone}
            valor={carregando ? 0 : resumo.campanhasAtivas}
            titulo="Campanhas Ativas"
            descricao="Arrecadações em andamento"
            corIcone="#ffb800"
            fundoIcone="#fff6db"
          />
          <StatCard
            icone={LuCalendar}
            valor={carregando ? 0 : resumo.eventosProximos}
            titulo="Eventos Próximos"
            descricao="Próximos 30 dias"
            corIcone="#10b981"
            fundoIcone="#e3f8ef"
          />
          <StatCard
            icone={LuHeart}
            valor={carregando ? 0 : resumo.noticiasRecentes}
            titulo="Notícias Recentes"
            descricao="Publicadas esta semana"
            corIcone="#8b5cf6"
            fundoIcone="#f0eafd"
          />
        </section>

        {/* Ações rápidas */}
        <section aria-labelledby="titulo-acoes">
          <h2
            id="titulo-acoes"
            className="m-0 mb-[16px] text-[20px] leading-[1.25] tracking-[-0.3px] font-extrabold"
          >
            Ações Rápidas
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px]">
            <div className={`${cardClass} p-[22px]`}>
              <h3 className="m-0 mb-[8px] text-[17px] font-extrabold">
                Nova Publicação
              </h3>
              <p className="m-0 mb-[12px] text-[#667b9b] text-[13.5px]">
                Crie campanhas ou notícias para o portal público
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin/publicacoes/nova")}
                className="h-[32px] px-[14px] inline-flex items-center gap-[6px] text-white font-inherit text-[13px] font-bold bg-[#2174b7] border-0 rounded-[6px] cursor-pointer transition-colors duration-150 hover:bg-[#1767a8]"
              >
                <FiPlus className="w-[14px] h-[14px]" />
                Criar Artigo
              </button>
            </div>

            <div className={`${cardClass} p-[22px]`}>
              <h3 className="m-0 mb-[8px] text-[17px] font-extrabold">
                Gerenciar Animais
              </h3>
              <p className="m-0 mb-[12px] text-[#667b9b] text-[13.5px]">
                Veja, adicione ou edite os animais da ONG
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin/animais")}
                className="h-[32px] px-[14px] text-white font-inherit text-[13px] font-bold bg-[#ffb800] border-0 rounded-[6px] cursor-pointer transition-colors duration-150 hover:bg-[#e6a600]"
              >
                Ir para Animais
              </button>
            </div>

            <div className={`${cardClass} p-[22px]`}>
              <h3 className="m-0 mb-[8px] text-[17px] font-extrabold">
                Ver Publicações
              </h3>
              <p className="m-0 mb-[12px] text-[#667b9b] text-[13.5px]">
                Edite, remova ou agende suas postagens
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin/publicacoes")}
                className="h-[32px] px-[14px] text-[#202b3e] font-inherit text-[13px] font-bold bg-[#eef2f6] border-0 rounded-[6px] cursor-pointer transition-colors duration-150 hover:bg-[#e2e8ef]"
              >
                Acessar Lista
              </button>
            </div>
          </div>
        </section>

        {/* Tabela + categorias */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_332px] gap-[16px] items-start">
          {/* Publicações recentes */}
          <section
            className={`${cardClass} p-[24px]`}
            aria-labelledby="titulo-recentes"
          >
            <h2
              id="titulo-recentes"
              className="m-0 mb-[16px] text-[20px] leading-[1.25] tracking-[-0.3px] font-extrabold"
            >
              Publicações Recentes
            </h2>

            <div className="overflow-x-auto border border-[#e8edf3] rounded-[4px]">
              <table className="w-full min-w-[620px] border-collapse text-left text-[13.5px]">
                <thead>
                  <tr className="bg-[#f7f9fb] text-[#667b9b] text-[12px] font-bold">
                    <th className="py-[14px] px-[16px] font-bold">Título</th>
                    <th className="py-[14px] px-[16px] font-bold">Categoria</th>
                    <th className="py-[14px] px-[16px] font-bold">Data</th>
                    <th className="py-[14px] px-[16px] font-bold">Status</th>
                    <th className="py-[14px] px-[16px] font-bold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {carregando ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-[32px] px-[16px] text-center text-[#667b9b]"
                      >
                        Carregando publicações...
                      </td>
                    </tr>
                  ) : publicacoesRecentes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-[32px] px-[16px] text-center text-[#667b9b]"
                      >
                        Nenhuma publicação cadastrada ainda.
                      </td>
                    </tr>
                  ) : (
                    publicacoesRecentes.map((publicacao) => {
                      const status = normalizarStatus(publicacao.status);
                      return (
                        <tr
                          key={publicacao.id}
                          className="border-t border-[#e8edf3]"
                        >
                          <td className="py-[16px] px-[16px] font-bold">
                            {publicacao.titulo || "Sem título"}
                          </td>
                          <td className="py-[16px] px-[16px] text-[#3d4b63]">
                            {publicacao.categoria || "—"}
                          </td>
                          <td className="py-[16px] px-[16px] text-[#667b9b] whitespace-nowrap">
                            {formatarData(extrairDataISO(publicacao))}
                          </td>
                          <td className="py-[16px] px-[16px]">
                            <span
                              className={`inline-block px-[8px] py-[3px] text-[11.5px] font-bold rounded-[4px] ${statusClass[status]}`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="py-[16px] px-[16px]">
                            <div className="flex items-center gap-[10px] text-[#687d9a]">
                              <button
                                type="button"
                                aria-label={`Ver ${publicacao.titulo}`}
                                onClick={() => verPublicacao(publicacao)}
                                className="p-0 flex bg-transparent border-0 text-inherit cursor-pointer hover:text-[#2174b7]"
                              >
                                <FiEye className="w-[17px] h-[17px]" />
                              </button>
                              <button
                                type="button"
                                aria-label={`Editar ${publicacao.titulo}`}
                                onClick={() => editarPublicacao(publicacao)}
                                className="p-0 flex bg-transparent border-0 text-inherit cursor-pointer hover:text-[#2174b7]"
                              >
                                <FiEdit className="w-[17px] h-[17px]" />
                              </button>
                              <button
                                type="button"
                                aria-label={`Excluir ${publicacao.titulo}`}
                                onClick={() => excluirPublicacao(publicacao)}
                                className="p-0 flex bg-transparent border-0 text-inherit cursor-pointer hover:text-[#c0392b]"
                              >
                                <FiTrash2 className="w-[17px] h-[17px]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Postagens por categoria */}
          <section
            className={`${cardClass} p-[24px]`}
            aria-labelledby="titulo-categorias"
          >
            <h2
              id="titulo-categorias"
              className="m-0 mb-[16px] text-[20px] leading-[1.25] tracking-[-0.3px] font-extrabold"
            >
              Postagens por Categoria
            </h2>

            <ul className="m-0 p-0 list-none flex flex-col gap-[14px]">
              {categorias.map((categoria) => (
                <li key={categoria.nome}>
                  <div className="flex items-center justify-between mb-[6px] text-[13.5px]">
                    <strong className="font-bold">{categoria.nome}</strong>
                    <span className="text-[#667b9b] text-[12.5px]">
                      {categoria.posts} posts
                    </span>
                  </div>
                  <div className="h-[8px] bg-[#eef2f6] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(categoria.posts / maiorQuantidade) * 100}%`,
                        backgroundColor: categoria.cor,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}