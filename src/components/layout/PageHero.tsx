import type { ReactNode } from "react";

interface PageHeroProps {
  titulo: ReactNode;
  descricao: ReactNode;
  /** Caminho da imagem de fundo. Sem imagem, o hero usa o azul da marca. */
  imagem?: string;
  /** Hero maior, usado só na Home. */
  grande?: boolean;
  /** Conteúdo extra abaixo do texto (ex.: botões). */
  children?: ReactNode;
}

export default function PageHero({
  titulo,
  descricao,
  imagem,
  grande = false,
  children,
}: PageHeroProps) {
  return (
    <section
      className={`relative flex items-center text-white ${
        grande ? "min-h-[430px]" : "min-h-[260px] md:min-h-[320px]"
      } ${imagem ? "bg-cover bg-center" : "bg-marca"}`}
      style={imagem ? { backgroundImage: `url('${imagem}')` } : undefined}
    >
      {imagem && <div className="absolute inset-0 bg-black/50" />}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 lg:px-14">
        <div className={grande ? "max-w-xl" : "max-w-2xl"}>
          <h1
            className={`font-extrabold ${
              grande ? "text-4xl leading-tight md:text-5xl" : "text-3xl md:text-4xl"
            }`}
          >
            {titulo}
          </h1>
          <p
            className={`text-sm leading-6 text-white/90 md:text-base ${
              grande ? "mt-4 max-w-lg" : "mt-3"
            }`}
          >
            {descricao}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
}