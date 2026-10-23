import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PublicFooter from "../../../components/layout/PublicFooter";
import { IconClose, IconPaw } from "../../../components/layout/Icons";
import {
  buscarPublicacao,
  formatarDataExtenso,
  type BlocoConteudo,
} from "../../../data/publicacoes";

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const publicacao = buscarPublicacao(id);

  // Abre sempre no topo da página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!publicacao) {
    return (
      <>
        <section className="bg-white px-5 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-zinc-800">Publicação não encontrada</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Ela pode ter sido removida ou o link está incorreto.
          </p>
          <Link
            to="/campanhas-e-noticias"
            className="mt-6 inline-block rounded-lg bg-marca px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            Ver todas as publicações
          </Link>
        </section>
        <PublicFooter />
      </>
    );
  }

  const blocos: BlocoConteudo[] = publicacao.conteudo ?? [
    { tipo: "paragrafo", texto: publicacao.resumo },
  ];

  const etiqueta = publicacao.urgente ? "Campanha urgente" : publicacao.categoria;

  return (
    <>
      <div className="bg-white md:px-5 md:py-10 lg:px-14">
        {/* No mobile os blocos seguem a ordem: imagem, etiqueta, título, texto.
            No desktop: título, imagem, etiqueta, texto. */}
        <article className="relative mx-auto flex max-w-5xl flex-col">
          {/* Título e autoria */}
          <header className="order-3 px-5 pt-3 md:order-1 md:px-0 md:pr-16 md:pt-0">
            <h1 className="text-2xl font-extrabold leading-tight text-zinc-900 md:text-[40px]">
              {publicacao.titulo}
            </h1>
            <p className="mt-2 text-xs text-slate-500 md:text-sm">
              {publicacao.autor ? `Por ${publicacao.autor} · ` : ""}
              {formatarDataExtenso(publicacao.data)}
            </p>
          </header>

          {/* Fechar (só no desktop) */}
          <Link
            to="/campanhas-e-noticias"
            aria-label="Fechar publicação"
            className="absolute right-0 top-0 hidden h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-zinc-600 transition-colors hover:bg-slate-200 md:flex"
          >
            <IconClose className="h-4 w-4" />
          </Link>

          {/* Imagem */}
          <img
            src={publicacao.imagem}
            alt={publicacao.titulo}
            className="order-1 h-56 w-full object-cover md:order-2 md:mt-6 md:h-[440px] md:rounded-2xl"
          />

          {/* Etiqueta */}
          <div className="order-2 px-5 pt-5 md:order-3 md:px-0 md:pt-6">
            <span className="inline-block rounded-full bg-destaque px-4 py-1.5 text-[11px] font-bold uppercase text-zinc-900">
              {etiqueta}
            </span>
          </div>

          {/* Conteúdo */}
          <div className="order-4 flex flex-col gap-4 px-5 pt-5 md:px-0 md:pt-6">
            {blocos.map((bloco, i) => {
              if (bloco.tipo === "titulo") {
                return (
                  <h2 key={i} className="mt-2 text-xl font-extrabold text-zinc-900 md:text-2xl">
                    {bloco.texto}
                  </h2>
                );
              }

              if (bloco.tipo === "lista") {
                return (
                  <ul key={i} className="flex flex-col gap-3 md:list-disc md:pl-6">
                    {bloco.itens.map((item) => (
                      <li key={item.texto} className="text-base leading-7 text-zinc-700 md:text-[15px] md:leading-6">
                        {item.destaque && (
                          <strong className="text-zinc-900">{item.destaque}: </strong>
                        )}
                        {item.texto}
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={i} className="text-base leading-7 text-zinc-700 md:text-[15px] md:leading-6">
                  {bloco.texto}
                </p>
              );
            })}
          </div>

          {/* Apoie nossa causa: barra fixa no rodapé no mobile, caixa no desktop */}
          <aside className="sticky bottom-0 z-10 order-5 mt-6 border-t border-zinc-200 bg-[#f8f9fb] px-5 py-3 md:static md:mt-10 md:flex md:items-center md:justify-between md:rounded-2xl md:border-0 md:bg-[#efefef] md:px-10 md:py-8">
            <div>
              <p className="text-sm font-bold text-marca md:text-lg">Apoie nossa causa</p>
              <p className="text-xs text-zinc-500 md:text-sm md:text-zinc-600">
                Juntos fazemos a diferença na vida dos animais!
              </p>
            </div>
            <Link
              to="/como-ajudar"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-destaque px-8 py-3 text-sm font-bold text-zinc-900 transition-colors hover:bg-destaque-escura md:mt-0 md:w-auto"
            >
              Quero ajudar
              <IconPaw className="h-4 w-4" />
            </Link>
          </aside>
        </article>
      </div>

    </>
  );
}