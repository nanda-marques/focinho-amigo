
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AnimalCard({ animal, variant = "home" }) {
  const isHome = variant === "home";
  const isAdocao = variant === "adocao";
  const isApadrinhamento = variant === "apadrinhamento";

  const [favorito, setFavorito] = useState(false);

  const destino = isApadrinhamento ? "/como-ajudar" : "/adocao";

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
        isHome
          ? "animal-card--home"
          : isApadrinhamento
            ? "animal-card--apadrinhamento"
            : "animal-card--adocao"
      }`}
    >
      {/* Imagem e botão de favorito */}
      <div className="relative shrink-0">
        <img
          src={animal.imagem}
          alt={`Foto de ${animal.nome}`}
          className="h-48 w-full object-cover"
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

          {/* Sexo: somente na Home e na tela de adoção */}
          {!isHome && !isApadrinhamento && (
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

        {/* Raça e idade: ocultas somente no apadrinhamento */}
        {!isApadrinhamento && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
              {animal.raca || animal.tipo || "Raça não informada"}
            </span>

            <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
              {animal.idade ||
                (animal.anos != null
                  ? `${animal.anos} ${
                      animal.anos === 1 ? "ano" : "anos"
                    }`
                  : "Idade não informada")}
            </span>
          </div>
        )}

        {/* Informações específicas de cada tela */}
        {isApadrinhamento ? (
          <div className="mt-3 flex flex-1 flex-col">
            <h4 className="text-xs font-bold text-zinc-800">
              Condição de saúde
            </h4>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              {animal.problemaSaude ||
                "Informações sobre a condição de saúde não disponíveis."}
            </p>

            {animal.prioridadeApadrinhamento && (
              <span className="mt-3 inline-block w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
                Precisa de apadrinhamento
              </span>
            )}
          </div>
        ) : (
          !isHome && (
            <>
              <p className="mt-3 flex-1 text-xs leading-5 text-zinc-500">
                {animal.descricao}
              </p>

              <div className="mt-2 text-xs text-zinc-500">
                Porte: {animal.porte || "Não informado"}
              </div>
            </>
          )
        )}

        {/* Botão de ação */}
        <Link
          to={destino}
          className="mt-4 block rounded-lg bg-marca px-4 py-2.5 text-center text-xs font-bold text-white transition hover:opacity-90"
        >
          {isApadrinhamento
            ? `Apadrinhar ${animal.nome}`
            : `Conhecer ${animal.nome}`}
        </Link>
      </div>
    </article>
  );
}
