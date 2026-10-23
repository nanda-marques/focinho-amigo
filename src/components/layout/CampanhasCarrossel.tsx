import { useState } from "react";
import { Link } from "react-router-dom";
import { IconChevronLeft, IconChevronRight } from "./Icons";
import type { Publicacao } from "../../data/publicacoes";

interface CampanhasCarrosselProps {
  campanhas: Publicacao[];
  /** "home": card com imagem colada na borda. "eventos": card maior com imagem arredondada. */
  variant?: "home" | "eventos";
}

export default function CampanhasCarrossel({
  campanhas,
  variant = "eventos",
}: CampanhasCarrosselProps) {
  const [indice, setIndice] = useState(0);
  const total = campanhas.length;

  if (total === 0) return null;

  const posicao = Math.min(indice, total - 1);
  const home = variant === "home";
  const mover = (delta: number) => setIndice((posicao + delta + total) % total);

  return (
    // Todos os cards ficam empilhados na mesma célula da grade. Assim a altura
    // do carrossel é a do maior card, e todos têm exatamente o mesmo tamanho.
    <div aria-roledescription="carousel" className="grid">
      {campanhas.map((c, i) => {
        const ativo = i === posicao;
        const urgente = Boolean(c.urgente);

        // Urgente: contorno amarelo e fundo amarelo claro.
        // Em destaque: contorno preto e fundo branco.
        const cores = home
          ? urgente
            ? "border border-destaque bg-[#fffdf3]"
            : "border border-zinc-900 bg-white"
          : urgente
            ? "border-2 border-destaque bg-amber-50"
            : "border-2 border-zinc-900 bg-white";

        const formato = home
          ? "overflow-hidden rounded-2xl md:grid-cols-[280px_1fr]"
          : "gap-5 rounded-3xl p-4 md:grid-cols-[minmax(0,350px)_1fr] md:items-center md:gap-8 md:p-8";

        return (
          <article
            key={c.id}
            aria-hidden={!ativo}
            className={`col-start-1 row-start-1 grid ${formato} ${cores} ${
              ativo ? "" : "invisible"
            }`}
          >
            <img
              src={c.imagem}
              alt={c.titulo}
              className={
                home
                  ? "h-52 w-full object-cover md:h-full md:min-h-[240px]"
                  : "h-52 w-full rounded-2xl object-cover md:h-[283px]"
              }
            />

            <div
              className={`flex flex-col ${
                home ? "p-6 md:p-8" : "md:min-h-[283px]"
              }`}
            >
              <div className="flex flex-1 flex-col justify-center">
                <span
                  className={`w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                    urgente ? "bg-destaque/30 text-amber-700" : "bg-sky-100 text-marca"
                  }`}
                >
                  {urgente ? "Campanha urgente" : "Em destaque"}
                </span>

                <h2 className="mt-3 text-2xl font-extrabold leading-tight text-zinc-800 md:text-[26px]">
                  <Link to={`/campanhas-e-noticias/${c.id}`} className="hover:underline">
                    {c.titulo}
                  </Link>
                </h2>

                <p className="mt-3 line-clamp-4 text-sm leading-6 text-zinc-600 md:line-clamp-none">
                  {c.resumo}
                </p>

                <Link
                  to="/como-ajudar"
                  className="mt-5 block rounded-lg bg-marca px-6 py-3 text-center text-sm font-bold text-white transition hover:opacity-90 md:w-fit"
                >
                  Contribuir Agora
                </Link>
              </div>

              {total > 1 && (
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {campanhas.map((outra, j) => (
                      <button
                        key={outra.id}
                        type="button"
                        aria-label={`Ir para a campanha ${j + 1}`}
                        aria-current={j === posicao}
                        onClick={() => setIndice(j)}
                        className={`h-2 rounded-full transition-all ${
                          j === posicao ? "w-6 bg-marca" : "w-2 bg-slate-300"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="hidden gap-2 md:flex">
                    <button
                      type="button"
                      aria-label="Campanha anterior"
                      onClick={() => mover(-1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-zinc-700 hover:bg-slate-200"
                    >
                      <IconChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Próxima campanha"
                      onClick={() => mover(1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-zinc-700 hover:bg-slate-200"
                    >
                      <IconChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}