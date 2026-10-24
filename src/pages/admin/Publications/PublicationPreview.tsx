import { useEffect, useState } from "react";
import type { JSX } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { LuMonitor, LuSmartphone, LuCheck } from "react-icons/lu";

import { publicacoesApi } from "../../../services/publicacoesApi";
import type { Publicacao } from "../../../services/publicacoesApi";
import logoImg from "../../../assets/logo.svg";

function mensagem(e: unknown): string {
  return e instanceof Error ? e.message : "";
}

const cardClass =
  "rounded-[12px] border border-[#e2e2e2] bg-white shadow-[0_2px_3px_rgb(0_0_0/22%)]";

export default function PublicationPreview(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [p, setP] = useState<Publicacao | null>(null);
  const [erro, setErro] = useState("");
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    if (!id) {
      setErro("ID da publicação não informado.");
      return;
    }

    let ativo = true;
    publicacoesApi
      .buscar(id)
      .then((dados) => {
        if (ativo) setP(dados);
      })
      .catch((e: unknown) => {
        if (ativo) setErro(mensagem(e));
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  async function publicar(): Promise<void> {
    if (!p) return;
    try {
      await publicacoesApi.salvar({ ...p, status: "publicado" });
      navigate("/admin/publicacoes");
    } catch (e: unknown) {
      setErro(mensagem(e));
    }
  }

  if (erro) {
    return (
      <main className="p-8">
        <p role="alert" className="text-red-700">
          {erro}
        </p>
        <Link to="/admin/publicacoes">Voltar às publicações</Link>
      </main>
    );
  }

  if (!p) {
    return (
      <main className="p-8 text-slate-500">
        Carregando pré-visualização...
      </main>
    );
  }

  const categoria = p.categoria ?? "";
  const conteudo = p.conteudo ?? "";
  const titulo = p.titulo;

  const checklist: [string, boolean][] = [
    ["Título preenchido", titulo.trim().length > 0],
    ["Imagem destacada carregada", Boolean(p.imagem)],
    ["Conteúdo principal", conteudo.trim().length > 0],
    ["Categoria selecionada", Boolean(categoria)],
  ];

  const statusLabel =
    p.status === "publicado"
      ? "Publicado"
      : p.status === "agendado"
      ? "Agendado"
      : p.status === "arquivado"
      ? "Arquivado"
      : "Rascunho";

  return (
    <div className="box-border flex min-h-screen min-w-0 flex-1 flex-col bg-[#f0f0f0] font-['Inter',Arial,sans-serif] text-[#202b3e] *:box-border">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-[#e2e2e2] bg-white py-4 pl-[72px] pr-5 sm:pr-8 lg:px-8 lg:py-5">
        <div className="flex items-center gap-3.5">
          <h1 className="m-0 text-[22px] font-extrabold leading-[1.2] tracking-[-0.5px] sm:text-[26px]">
            Pré-visualização
          </h1>
          <div className="flex gap-1 rounded-[8px] bg-[#eef2f6] p-1">
            <button
              type="button"
              title="Desktop"
              onClick={() => setMobile(false)}
              className={`grid h-[28px] w-[30px] cursor-pointer place-items-center rounded-[6px] border-0 ${
                !mobile
                  ? "bg-white text-[#2174b7] shadow-sm"
                  : "bg-transparent text-[#687d9a]"
              }`}
            >
              <LuMonitor size={16} />
            </button>
            <button
              type="button"
              title="Celular"
              onClick={() => setMobile(true)}
              className={`grid h-[28px] w-[30px] cursor-pointer place-items-center rounded-[6px] border-0 ${
                mobile
                  ? "bg-white text-[#2174b7] shadow-sm"
                  : "bg-transparent text-[#687d9a]"
              }`}
            >
              <LuSmartphone size={16} />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to={`/admin/publicacoes/${id}/editar`}
            className="flex h-[36px] items-center rounded-[8px] border border-[#dce5ef] bg-white px-4 text-[13px] font-bold text-[#667b9b] no-underline transition-colors hover:bg-[#f7f9fb]"
          >
            Voltar para Edição
          </Link>
          <button
            type="button"
            onClick={publicar}
            className="h-[36px] cursor-pointer rounded-[8px] border-0 bg-[#ffb800] px-4 text-[13px] font-bold text-white transition-colors hover:bg-[#e6a600]"
          >
            Publicar Agora
          </button>
        </div>
      </header>

      <main className="flex-1 p-5 sm:p-6 lg:p-8">
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_282px]">
          <section
            className={`${cardClass} mx-auto min-h-[520px] overflow-hidden ${
              mobile ? "w-[390px] max-w-full" : "w-full"
            }`}
          >
            <div className="flex items-center gap-2 border-b border-[#e2e8ef] bg-[#f1f4f8] px-3.5 py-2.5">
              <i className="h-[10px] w-[10px] rounded-full bg-[#ef4444]" />
              <i className="h-[10px] w-[10px] rounded-full bg-[#f59e0b]" />
              <i className="h-[10px] w-[10px] rounded-full bg-[#10b981]" />
              <div className="ml-2.5 min-w-0 flex-1 truncate rounded-[4px] bg-white px-3 py-0.5 text-[11.5px] text-[#687d9a]">
                focinho-amigo.org.br/publicacoes/
                {categoria.toLowerCase().replace(/\s+/g, "-")}
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-[#eef2f6] px-6 py-4">
              <img
                src={logoImg}
                alt="Logo Focinho Amigo"
                className="h-10 w-10 object-contain"
              />
              <div>
                <strong className="text-[18px] font-extrabold text-[#2174b7]">
                  Focinho Amigo
                </strong>
                <p className="m-0 text-xs font-bold text-destaque">
                  NOS AJUDE A SALVAR VIDAS.
                </p>
              </div>
              <nav className="ml-auto hidden gap-5 text-[13px] font-semibold md:flex">
                <span>Início</span>
                <span>Adoção</span>
                <span>Apadrinhamento</span>
                <span>Voluntariado</span>
                <span className="text-[#2174b7]">Publicações</span>
                <span>Como ajudar</span>
                <span>Contato</span>
              </nav>
            </div>
            <div className={mobile ? "p-4" : "p-8"}>
              <article
                className={`rounded-[28px] border-2 ${
                  mobile ? "p-4" : "p-8"
                } ${
                  p.urgente
                    ? "border-[#ffb800] bg-[#fff9e1]"
                    : "border-[#e8edf3] bg-white"
                } ${
                  p.urgente && !mobile && p.imagem
                    ? "grid grid-cols-2 items-center gap-7"
                    : ""
                }`}
              >
                {p.imagem && (
                  <img
                    src={p.imagem}
                    alt=""
                    className={`w-full rounded-[20px] object-cover ${
                      p.urgente && !mobile
                        ? "max-h-[320px]"
                        : "mb-6 max-h-[360px]"
                    }`}
                  />
                )}
                <div className="min-w-0">
                  {p.urgente && (
                    <span className="mb-3.5 inline-block rounded-full bg-[#fde9b5] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.3px] text-[#d97706]">
                      Campanha urgente
                    </span>
                  )}
                  {p.destaque && (
                    <span
                      className={`mb-3.5 inline-block rounded-full bg-[#dbeafe] px-3 py-1 text-[11px] font-extrabold text-[#1d4ed8] ${
                        p.urgente ? "ml-2" : ""
                      }`}
                    >
                      Em destaque
                    </span>
                  )}
                  <p className="m-0 mb-2 text-[11.5px] font-semibold uppercase tracking-wide text-[#2174b7]">
                    {categoria}{" "}
                    {p.dataPublicacao ? `• ${p.dataPublicacao}` : ""}
                  </p>
                  <h2
                    className={`m-0 mb-3.5 font-extrabold leading-[1.2] tracking-[-0.5px] text-[#242424] break-words [overflow-wrap:anywhere] hyphens-auto ${
                      mobile ? "text-[24px]" : "text-[30px]"
                    }`}
                  >
                    {titulo}
                  </h2>
                  {p.descricao && (
                    <p className="m-0 mb-4 text-[15px] leading-[1.6] text-[#4b5b73] break-words [overflow-wrap:anywhere]">
                      {p.descricao}
                    </p>
                  )}
                  <div
                    className="max-w-none text-[14.5px] leading-[1.7] text-[#334155] break-words [overflow-wrap:anywhere] [&_a]:text-[#2174b7] [&_a]:underline [&_img]:max-w-full [&_p]:mb-3 [&_p]:mt-0"
                    dangerouslySetInnerHTML={{ __html: conteudo }}
                  />
                  {categoria.toLowerCase().includes("campanha") && (
                    <button
                      type="button"
                      className="mt-5 cursor-pointer rounded-[8px] border-0 bg-[#2174b7] px-[22px] py-3 text-[15px] font-bold text-white"
                    >
                      Contribuir Agora
                    </button>
                  )}
                </div>
              </article>
            </div>
          </section>

          <aside className={`${cardClass} p-6`}>
            <h2 className="m-0 mb-4 text-[18px] font-extrabold leading-[1.25] tracking-[-0.3px]">
              Detalhes da Publicação
            </h2>
            <dl className="m-0 space-y-[10px] text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-[#667b9b]">Status</dt>
                <dd className="m-0 text-right font-bold">{statusLabel}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#667b9b]">Categoria</dt>
                <dd className="m-0 text-right font-bold">
                  {categoria || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#667b9b]">Data de Lançamento</dt>
                <dd className="m-0 text-right font-bold">
                  {p.dataPublicacao || "Não definida"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#667b9b]">Autor</dt>
                <dd className="m-0 text-right font-bold">
                  {p.autor || "Não informado"}
                </dd>
              </div>
            </dl>
            <hr className="my-4.5 border-0 border-t border-[#e8edf3]" />
            <h3 className="m-0 mb-3 text-[14px] font-extrabold">
              Checklist de Validação
            </h3>
            {checklist.map(([texto, ok]) => (
              <p
                key={texto}
                className="m-0 mb-2.5 flex items-center gap-2.5 text-[13px]"
              >
                <LuCheck
                  className={ok ? "text-[#10b981]" : "text-[#cbd5e1]"}
                />
                {texto}
              </p>
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
}