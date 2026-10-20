import { useEffect, useState } from "react";
import {
  IconCheckCircle,
  IconChevronLeft,
  IconChevronRight,
  IconChip,
  IconClose,
  IconHeart,
  IconPaw,
  IconPill,
  IconScissors,
  IconSyringe,
} from "../layout/Icons";

const requisitos = [
  "Termo de responsabilidade",
  "Comprovante de residência",
  "Visita prévia ao lar",
  "Acompanhamento pós-adoção",
];

const iconesHistorico = {
  vacinacao: IconSyringe,
  vermifugacao: IconPill,
  castracao: IconScissors,
  microchip: IconChip,
};

function Campo({ label, children }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-zinc-900">{children}</p>
    </div>
  );
}

function Bloco({ titulo, children }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 md:p-4">
      <h3 className="text-lg font-bold text-zinc-900">{titulo}</h3>
      {children}
    </section>
  );
}

/**
 * Pop-up com os detalhes de um animal.
 * Props:
 *  - pet: objeto do animal (ver src/data/pets.js). Os campos em `pet.detalhes`
 *    são opcionais: seções sem dados simplesmente não aparecem.
 *  - onClose: fecha o pop-up
 *  - onAdopt: chamado ao clicar em "Quero Adotar"
 */
export default function PetDetailsModal({ pet, onClose, onAdopt }) {
  const [foto, setFoto] = useState(0);
  const d = pet.detalhes || {};
  const fotos = d.fotos?.length ? d.fotos : [pet.imagem];

  // Fecha com Esc e trava a rolagem da página enquanto estiver aberto
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = anterior;
    };
  }, [onClose]);

  const anterior = () => setFoto((i) => (i - 1 + fotos.length) % fotos.length);
  const proxima = () => setFoto((i) => (i + 1) % fotos.length);

  const femea = pet.sexo === "F";

  // Funciona com os dados simples de pets.js: o que não existir em `detalhes`
  // cai para os campos básicos do animal (raça, tags, descrição).
  const temperamento = d.temperamento || (pet.tags?.length ? pet.tags.join(" ▪ ") : null);
  const sobre = d.sobre || pet.descricao;

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/50 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pet-modal-titulo"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-full max-w-[1100px] flex-col overflow-hidden bg-white shadow-2xl md:max-h-[92vh] md:rounded-2xl"
      >
        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Cabeçalho */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="pet-modal-titulo" className="text-2xl font-extrabold text-zinc-900 md:text-3xl">
                {pet.nome}
              </h2>
              <div className="mt-2 flex gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-sky-100 px-2.5 py-1 text-xs font-bold text-marca">
                  <IconPaw className="h-3.5 w-3.5" />
                  {pet.tipo}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold ${
                    femea ? "bg-red-50 text-red-500" : "bg-sky-100 text-marca"
                  }`}
                >
                  {femea ? "♀ Fêmea" : "♂ Macho"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-zinc-700 transition-colors hover:bg-slate-200 md:h-11 md:w-11"
            >
              <IconClose className="h-4 w-4" />
            </button>
          </div>

          {/* Galeria */}
          <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,560px)_1fr] md:gap-4">
            <img
              src={fotos[foto]}
              alt={`Foto de ${pet.nome}`}
              className="h-64 w-full rounded-2xl object-cover md:h-[360px]"
            />

            <div>
              <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                {fotos.map((src, i) => (
                  <button
                    key={`${i}-${src}`}
                    type="button"
                    onClick={() => setFoto(i)}
                    aria-label={`Ver foto ${i + 1}`}
                    aria-current={i === foto}
                    className={`overflow-hidden rounded-lg transition ${
                      i === foto ? "ring-2 ring-marca ring-offset-2" : "opacity-90 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt="" className="h-14 w-14 object-cover md:h-[120px] md:w-[81px]" />
                  </button>
                ))}
              </div>

              {fotos.length > 1 && (
                <div className="mt-4 hidden items-center justify-between md:flex md:max-w-[360px]">
                  <div className="flex items-center gap-2">
                    {fotos.map((src, i) => (
                      <span
                        key={`${i}-${src}`}
                        className={`h-2 rounded-full transition-all ${
                          i === foto ? "w-6 bg-marca" : "w-2 bg-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={anterior} aria-label="Foto anterior" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-zinc-700 hover:bg-slate-200">
                      <IconChevronLeft className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={proxima} aria-label="Próxima foto" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-zinc-700 hover:bg-slate-200">
                      <IconChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {/* Informações */}
            <section className="rounded-xl border border-zinc-200 bg-[#f8f9fb] p-4">
              <h3 className="text-lg font-bold text-zinc-900">Informações</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Campo label="Idade">
                  {d.idadeEstimada ? (
                    <>
                      <span className="hidden md:inline">Estimada: </span>
                      {d.idadeEstimada}
                    </>
                  ) : (
                    pet.idade || (pet.anos != null ? `${pet.anos} ${pet.anos === 1 ? "ano" : "anos"}` : "Não informada")
                  )}
                </Campo>
                <Campo label="Porte">{d.porte || pet.porte || "Não informado"}</Campo>
                {pet.raca && <Campo label="Raça">{pet.raca}</Campo>}
                {d.peso && <Campo label="Peso">{d.peso}</Campo>}
                {d.castrado && <Campo label="Castrado">{d.castrado}</Campo>}
                {d.cor && <Campo label="Cor">{d.cor}</Campo>}
                {temperamento && <Campo label="Temperamento">{temperamento}</Campo>}
              </div>
            </section>

            {/* Sobre */}
            {sobre && (
              <Bloco titulo="Sobre">
                <p className="mt-2 text-sm leading-6 text-zinc-600 md:text-[15px] md:leading-7">
                  {sobre}
                </p>
              </Bloco>
            )}

            {/* Histórico médico */}
            {d.historico?.length > 0 && (
              <Bloco titulo="Histórico Médico">
                <ul className="mt-3 flex flex-col gap-3">
                  {d.historico.map((h) => {
                    const Icone = iconesHistorico[h.tipo] || IconPill;
                    return (
                      <li key={h.titulo} className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-marca">
                          <Icone className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-bold text-zinc-900">{h.titulo}</p>
                          <p className="text-xs leading-5 text-zinc-600 md:text-[13px]">{h.texto}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Bloco>
            )}

            {/* Requisitos */}
            <Bloco titulo="Requisitos para Adoção">
              <ul className="mt-3 flex flex-col gap-2">
                {requisitos.map((r) => (
                  <li key={r} className="flex items-center gap-2.5 text-sm text-zinc-700 md:text-[15px]">
                    <IconCheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </Bloco>
          </div>
        </div>

        {/* Botão fixo no rodapé do pop-up */}
        <div className="border-t border-zinc-100 bg-white p-4 md:px-6 md:pb-5 md:pt-3">
          <button
            type="button"
            onClick={onAdopt}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3.5 text-base font-bold text-white transition-colors hover:bg-orange-600"
          >
            <IconHeart className="h-5 w-5" />
            Quero Adotar
          </button>
        </div>
      </div>
    </div>
  );
}