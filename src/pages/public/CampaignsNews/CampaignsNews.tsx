import { useEffect, useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import PublicFooter from "../../../components/layout/PublicFooter";
import PageHero from "../../../components/layout/PageHero";
import CampanhasCarrossel from "../../../components/layout/CampanhasCarrossel";
import {
  IconFacebook,
  IconInstagram,
  IconTikTok,
  type IconProps,
} from "../../../components/layout/Icons";
import {
  campanhasEmDestaque,
  formatarDataCurta,
  publicacoes,
  type Categoria,
  type Publicacao,
} from "../../../data/publicacoes";

// Imagens ficam na pasta public: /images/eventos/<arquivo>

type Filtro = "Todas" | "Campanhas" | "Eventos" | "Notícias";

interface Rede {
  nome: string;
  seguidores: string;
  href: string;
  Icone: ComponentType<IconProps>;
}

const filtros: Filtro[] = ["Todas", "Campanhas", "Eventos", "Notícias"];

// Filtro da tela -> categoria das publicações ("Todas" não filtra)
const categoriaDoFiltro: Record<Exclude<Filtro, "Todas">, Categoria> = {
  Campanhas: "Campanha",
  Eventos: "Eventos",
  Notícias: "Notícias",
};

const estiloCategoria: Record<Categoria, string> = {
  Campanha: "bg-destaque text-zinc-900",
  Eventos: "bg-green-600 text-white",
  Adoções: "bg-orange-500 text-white",
  Notícias: "bg-marca text-white",
};

// TODO: trocar pelos perfis e números reais
const redes: Rede[] = [
  { nome: "Instagram", seguidores: "21K seguidores", href: "https://www.instagram.com/focinhoamigoindaiatuba/", Icone: IconInstagram },
  { nome: "Facebook", seguidores: "12K seguidores", href: "https://www.facebook.com/", Icone: IconFacebook },
  { nome: "TikTok", seguidores: "2K seguidores", href: "https://www.tiktok.com/", Icone: IconTikTok },
];

// Quem está no carrossel não repete na lista "Mais Publicações"
const idsNoCarrossel = new Set(campanhasEmDestaque.map((c) => c.id));

// 6 por página no desktop, 3 no mobile (como nos prints)
function useItensPorPagina(): number {
  const consulta = "(min-width: 768px)";
  const [desktop, setDesktop] = useState<boolean>(() =>
    typeof window === "undefined" ? true : window.matchMedia(consulta).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(consulta);
    const aoMudar = (e: MediaQueryListEvent) => setDesktop(e.matches);
    mql.addEventListener("change", aoMudar);
    return () => mql.removeEventListener("change", aoMudar);
  }, []);

  return desktop ? 6 : 3;
}

export default function CampaignsNews() {
  const [filtro, setFiltro] = useState<Filtro>("Todas");
  const [pagina, setPagina] = useState<number>(1);
  const porPagina = useItensPorPagina();

  const combinaComFiltro = (p: Publicacao) =>
    filtro === "Todas" || p.categoria === categoriaDoFiltro[filtro];

  const campanhasVisiveis = campanhasEmDestaque.filter(combinaComFiltro);
  const outras = publicacoes.filter(
    (p) => !idsNoCarrossel.has(p.id) && combinaComFiltro(p)
  );

  const totalPaginas = Math.max(1, Math.ceil(outras.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = outras.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);

  const semNada = campanhasVisiveis.length === 0 && outras.length === 0;

  const pagBtn =
    "flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-xs font-bold transition-colors";

  return (
    <>
      <PageHero
        titulo="Acompanhe as Novidades"
        descricao="Fique por dentro das campanhas de arrecadação, eventos beneficentes, histórias de resgates e notícias mais recentes da Focinho Amigo."
      />

      <section className="bg-white px-5 py-6 lg:px-14 lg:py-8">
        <div className="mx-auto max-w-7xl">
          {/* Filtros */}
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0">
            {filtros.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFiltro(f);
                  setPagina(1);
                }}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition-colors ${
                  filtro === f
                    ? "border-marca bg-marca text-white"
                    : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {semNada && (
            <p className="mt-10 text-center text-sm text-zinc-500">
              Nenhuma publicação por enquanto.
            </p>
          )}

          {/* Carrossel: campanhas urgentes primeiro, depois as em destaque */}
          {campanhasVisiveis.length > 0 && (
            <div className="mt-6">
              <CampanhasCarrossel campanhas={campanhasVisiveis} variant="eventos" />
            </div>
          )}

          {/* Publicações */}
          {outras.length > 0 && (
            <>
              <h2 className="mt-10 text-2xl font-extrabold text-zinc-800">Mais Publicações</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {visiveis.map((p) => (
                  <article key={p.id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <img src={p.imagem} alt="" className="h-48 w-full object-cover md:h-52" />
                    <div className="p-5">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${estiloCategoria[p.categoria]}`}>
                        {p.categoria}
                      </span>
                      <h3 className="mt-3 text-lg font-bold leading-snug text-zinc-800">{p.titulo}</h3>
                      <p className="mt-1 text-xs text-zinc-400">{formatarDataCurta(p.data)}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-5 text-zinc-500">{p.resumo}</p>
                      <Link
                        to={`/campanhas-e-noticias/${p.id}`}
                        className="mt-3 inline-block text-sm font-bold text-marca hover:underline"
                      >
                        Saiba mais
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Paginação */}
              <nav aria-label="Paginação" className="mt-8 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={paginaAtual === 1}
                  onClick={() => setPagina(paginaAtual - 1)}
                  className={`${pagBtn} bg-slate-200 text-zinc-700 hover:bg-slate-300 disabled:opacity-50`}
                >
                  Anterior
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-current={n === paginaAtual ? "page" : undefined}
                    onClick={() => setPagina(n)}
                    className={`${pagBtn} ${
                      n === paginaAtual
                        ? "bg-marca text-white"
                        : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={paginaAtual === totalPaginas}
                  onClick={() => setPagina(paginaAtual + 1)}
                  className={`${pagBtn} bg-marca text-white hover:opacity-90 disabled:opacity-50`}
                >
                  Próximo
                </button>
              </nav>
            </>
          )}
        </div>
      </section>

      {/* =====================================================
          REDES SOCIAIS
      ====================================================== */}
      <section className="bg-[#f1f1f1] px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-extrabold text-zinc-800 md:text-3xl">Siga-nos nas Redes Sociais</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Acompanhe nosso trabalho e compartilhe amor! Veja resgates em tempo real.
          </p>
          <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-3 md:gap-5">
            {redes.map(({ nome, seguidores, href, Icone }) => (
              <a
                key={nome}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center rounded-xl bg-white px-2 py-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:py-6"
              >
                <Icone className="h-7 w-7 text-zinc-800" />
                <strong className="mt-2 text-sm text-zinc-900">{nome}</strong>
                <span className="mt-0.5 text-[11px] text-zinc-400">{seguidores}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}