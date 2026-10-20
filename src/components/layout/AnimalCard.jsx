import { useState } from "react";
import { Link } from "react-router-dom";

export default function AnimalCard({ animal, variant = "home", onConhecer }) {
  const isHome = variant === "home";
  const [favorito, setFavorito] = useState(false);

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
        isHome ? "animal-card--home" : "animal-card--adocao"
      }`}
    >
      {/* Imagem e botão de favorito */}
      <div className="relative shrink-0">
        <img
          src={animal.imagem}
          alt={`Foto de ${animal.nome}`}
          className={`w-full object-cover ${
            isHome ? "h-48" : "h-48"
          }`}
        />

        <button
          type="button"
          onClick={() => setFavorito(!favorito)}
          aria-label={
            favorito
              ? `Remover ${animal.nome} dos favoritos`
              : `Adicionar ${animal.nome} aos favoritos`
          }
          aria-pressed={favorito}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 ${
            favorito ? "text-red-500" : "text-zinc-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={favorito ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
            />
          </svg>
        </button>
      </div>

      {/* Informações do animal */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-zinc-800">
            {animal.nome}
          </h3>

          {!isHome && (
            <span
              role="img"
              aria-label={animal.sexo === "F" ? "Fêmea" : "Macho"}
              className={`text-base font-bold ${
                animal.sexo === "F" ? "text-red-500" : "text-marca"
              }`}
            >
              {animal.sexo === "F" ? "♀" : "♂"}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
            {animal.raca || animal.tipo || "Raça não informada"}
          </span>

          <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
            {animal.idade || (
              animal.anos != null
                ? `${animal.anos} ${animal.anos === 1 ? "ano" : "anos"}`
                : "Idade não informada"
            )}
          </span>
        </div>

        {!isHome && (
          <>
            <p className="mt-3 flex-1 text-xs leading-5 text-zinc-500">
              {animal.descricao}
            </p>

            <div className="mt-2 text-xs text-zinc-500">
              Porte: {animal.porte || "Não informado"}
            </div>
          </>
        )}

        {onConhecer ? (
          <button
            type="button"
            onClick={() => onConhecer(animal)}
            className="mt-4 block w-full rounded-lg bg-marca px-4 py-2.5 text-center text-xs font-bold text-white transition hover:opacity-90"
          >
            Conhecer {animal.nome}
          </button>
        ) : (
          <Link
            to={animal.id != null ? `/adocao?animal=${animal.id}` : "/adocao"}
            className="mt-4 block rounded-lg bg-marca px-4 py-2.5 text-center text-xs font-bold text-white transition hover:opacity-90"
          >
            Conhecer {animal.nome}
          </Link>
        )}
      </div>
    </article>
  );
}