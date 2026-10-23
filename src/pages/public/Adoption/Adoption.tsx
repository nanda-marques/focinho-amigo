import { useMemo, useState } from "react";
import type { Dispatch, JSX, SetStateAction } from "react";
import { useSearchParams } from "react-router-dom";
import PageHero from "../../../components/layout/PageHero";
import PublicFooter from "../../../components/layout/PublicFooter";
import AnimalCard from "../../../components/layout/AnimalCard";
import PetDetailsModal from "../../../components/adoption/PetDetailsModal";
import { pets } from "../../../data/pets";
import type { Pet } from "../../../data/pets";

/** Props do componente de filtro. */
interface SelectFiltroProps {
  label: string;
  value: string;
  onChange: (valor: string) => void;
  options: Array<{ value: string; label: string }>;
}

const LINK_FORMULARIO = "https://forms.google.com/";
const PER_PAGE = 6;

const passos = [
  {
    titulo: "Entrevista",
    texto:
      'Bate-papo para entendermos seu perfil, sua rotina e garantir o "match" perfeito com o pet.',
  },
  {
    titulo: "Vistoria",
    texto:
      "Verificação do ambiente para atestar que o local é seguro e adequado para receber o animal.",
  },
  {
    titulo: "Proteção",
    texto:
      "Para adoção de gatos, é obrigatória a instalação prévia de redes de proteção nas janelas.",
  },
];

const criterios = [
  "Ter idade igual ou superior a 18 anos completos.",
  "Apresentar via impressa do RG, CPF e Comprovante de Residência recente (últimos 3 meses).",
  "Garantir ambiente seguro e telado (no caso de gatinhos ou cães em sobrados).",
  "Assinar o Termo de Responsabilidade e Adoção Consciente no dia de levar o peludinho.",
];

const duvidas = [
  {
    pergunta: "Quais são os custos da adoção?",
    resposta:
      "A adoção na Focinho Amigo é 100% gratuita. No entanto, aceitamos contribuições voluntárias para nos ajudar a continuar resgatando outros amiguinhos que continuam precisando de ajuda médica.",
  },
  {
    pergunta: "Os animais já vêm prontos para ir para casa?",
    resposta:
      "Sim. Todos os nossos pets adultos e jovens são entregues integralmente castrados, vacinados com doses anuais em dia (V10/V12, Antirrábica) e desverminados.",
  },
  {
    pergunta: "Moro em apartamento, posso adotar?",
    resposta:
      "Claro! Muitos dos nossos cãezinhos de médio e pequeno porte e, principalmente, todos os gatinhos se adaptam com maestria a apartamentos, desde que haja telas de proteção e passeios regulares.",
  },
  {
    pergunta: "E se o pet não se adaptar bem à nova casa?",
    resposta:
      "Nós oferecemos suporte pós-adoção com adestradores voluntários parceiros para facilitar a transição. Em último caso, o pet retorna ao abrigo. Nunca o abandone ou repasse sem nossa supervisão.",
  },
];

const depoimentos = [
  {
    texto:
      "“A Amora mudou nossas vidas. Todo o processo de adoção da Focinho Amigo foi feito com muita transparência e respeito pelo bem-estar animal. Somos eternamente gratos!”",
    nome: "Mariana Silva",
    pet: "Adotou a Amora",
  },
  {
    texto:
      "“O Pipoca era super medroso quando chegou, mas com as instruções da ONG e muito amor, hoje ele corre feliz e confia em todo mundo. Adotar é tudo de bom!”",
    nome: "Rodrigo Costa",
    pet: "Adotou o Pipoca",
  },
];

const filtroTipos = [
  { value: "todos", label: "Todos" },
  { value: "Cão", label: "Cães" },
  { value: "Gato", label: "Gatos" },
];

const selectClass =
  "cursor-pointer bg-transparent text-xs font-bold text-marca focus:outline-none";

function SelectFiltro({
  label,
  value,
  onChange,
  options,
}: SelectFiltroProps): JSX.Element {
  return (
    <label className="flex items-center gap-1.5 text-xs text-zinc-600">
      {label}:
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Página de adoção com filtros, cards, modal de detalhes e formulário. */
export default function Adoption(): JSX.Element {
  const [tipo, setTipo] = useState("todos");
  const [porte, setPorte] = useState("todos");
  const [sexo, setSexo] = useState("todos");
  const [idade, setIdade] = useState("todos");
  const [pagina, setPagina] = useState(1);
  const [abertaFaq, setAbertaFaq] = useState<number | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const idDaUrl = searchParams.get("animal");
  const petAberto: Pet | null =
    pets.find((p) => String(p.id) === idDaUrl) ?? null;

  const abrirPet = (pet: Pet) => setSearchParams({ animal: String(pet.id) });

  const fecharPet = () => setSearchParams({});

  const irParaFormulario = () => {
    fecharPet();
    window.setTimeout(
      () =>
        document
          .getElementById("formulario")
          ?.scrollIntoView({ behavior: "smooth" }),
      0
    );
  };

  const filtrados = useMemo(
    () =>
      pets.filter((p: Pet) => {
        if (tipo !== "todos" && p.tipo !== tipo) return false;
        if (porte !== "todos" && p.porte !== porte) return false;
        if (sexo !== "todos" && p.sexo !== sexo) return false;

        const anos = p.anos ?? 0;
        if (idade === "filhote" && anos > 1) return false;
        if (idade === "adulto" && (anos < 2 || anos > 5)) return false;
        if (idade === "idoso" && anos < 6) return false;
        return true;
      }),
    [tipo, porte, sexo, idade]
  );

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtrados.slice(
    (paginaAtual - 1) * PER_PAGE,
    paginaAtual * PER_PAGE
  );

  const mudar =
    (setter: Dispatch<SetStateAction<string>>) => (valor: string) => {
      setter(valor);
      setPagina(1);
    };

  const pagBtn =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-white";

  return (
    <>
     <PageHero
  titulo="Adote um Amigo"
  descricao="Abra os braços para um carinho sincero e sinta a incomparável emoção de salvar e acolher uma vida."
  imagem="src/assets/images/hero/heroAdoption.png"
>
  <a
    href="#formulario"
    className="mt-5 block rounded-lg bg-marca px-5 py-3 text-center text-sm font-bold text-white transition hover:opacity-90 md:inline-block"
  >
    <span className="md:hidden">Formulário de Adoção</span>
    <span className="hidden md:inline">Preencher Formulário de Adoção</span>
  </a>
</PageHero>

      {/* NOSSOS PELUDOS */}
      <section className="bg-[#f8f9fb] px-5 py-10 lg:px-14 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Nossos Peludos
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Eles estão com exames em dia, vacinados, castrados e esperando
            ansiosamente por você.
          </p>

          {/* Filtros */}
          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:rounded-xl md:border md:border-zinc-200 md:bg-white md:px-4 md:py-3">
            <div className="flex gap-2">
              {filtroTipos.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => mudar(setTipo)(f.value)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                    tipo === f.value
                      ? "bg-marca text-white"
                      : "bg-slate-200 text-zinc-700 hover:bg-slate-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="hidden items-center gap-6 md:flex">
              <SelectFiltro
                label="Porte"
                value={porte}
                onChange={mudar(setPorte)}
                options={[
                  { value: "todos", label: "Qualquer" },
                  { value: "Pequeno", label: "Pequeno" },
                  { value: "Médio", label: "Médio" },
                  { value: "Grande", label: "Grande" },
                ]}
              />
              <SelectFiltro
                label="Sexo"
                value={sexo}
                onChange={mudar(setSexo)}
                options={[
                  { value: "todos", label: "Qualquer" },
                  { value: "F", label: "Fêmea" },
                  { value: "M", label: "Macho" },
                ]}
              />
              <SelectFiltro
                label="Idade"
                value={idade}
                onChange={mudar(setIdade)}
                options={[
                  { value: "todos", label: "Qualquer" },
                  { value: "filhote", label: "Até 1 ano" },
                  { value: "adulto", label: "2 a 5 anos" },
                  { value: "idoso", label: "6 anos ou mais" },
                ]}
              />
            </div>
          </div>

          {/* Cards */}
          {visiveis.length === 0 ? (
            <p className="mt-10 text-center text-sm text-zinc-500">
              Nenhum animal encontrado com esses filtros.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visiveis.map((pet) => (
                <AnimalCard
                  key={pet.id}
                  animal={pet}
                  variant="adocao"
                  onConhecer={abrirPet}
                />
              ))}
            </div>
          )}

          {/* Paginação */}
          <nav
            aria-label="Paginação"
            className="mt-8 flex items-center justify-center gap-2"
          >
            <button
              type="button"
              aria-label="Página anterior"
              disabled={paginaAtual === 1}
              onClick={() => setPagina(paginaAtual - 1)}
              className={pagBtn}
            >
              ‹
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                aria-current={n === paginaAtual ? "page" : undefined}
                onClick={() => setPagina(n)}
                className={`${pagBtn} ${
                  n === paginaAtual
                    ? "!border-marca !bg-marca text-white hover:!bg-marca"
                    : ""
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              aria-label="Próxima página"
              disabled={paginaAtual === totalPaginas}
              onClick={() => setPagina(paginaAtual + 1)}
              className={pagBtn}
            >
              ›
            </button>
          </nav>
        </div>
      </section>

      {/* 3 PASSOS */}
      <section className="bg-white px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-zinc-800 md:text-3xl">
            3 Passos Simples para Adotar
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
            {passos.map((p, i) => (
              <article key={p.titulo} className="rounded-2xl bg-[#f8f9fb] p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-marca font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-bold text-zinc-800">
                  {p.titulo}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {p.texto}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CRITÉRIOS */}
      <section className="bg-[#f1f1f1] px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Critérios Essenciais para a Adoção
          </h2>
          <ul className="mt-6 flex flex-col gap-3">
            {criterios.map((c) => (
              <li
                key={c}
                className="flex items-start gap-3 text-sm text-zinc-800"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destaque text-[11px] font-bold text-zinc-900">
                  ✓
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section
        id="formulario"
        className="scroll-mt-4 bg-white px-5 py-12 lg:px-14 lg:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Inicie seu Processo de Adoção
          </h2>
          <div className="mt-8 flex flex-col items-center rounded-xl border-2 border-dashed border-marca px-5 py-12 text-center md:py-16">
            <span className="text-3xl text-marca">▤</span>
            <h3 className="mt-3 text-base font-bold text-zinc-800">
              Formulário de Adoção (Google Forms)
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Carregamento automático do formulário seguro incorporado.
            </p>
            <a
              href={LINK_FORMULARIO}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 rounded-lg bg-marca px-6 py-2.5 text-xs font-bold text-white transition hover:opacity-90"
            >
              Abrir em Nova Aba
            </a>
          </div>
        </div>
      </section>

      {/* DÚVIDAS FREQUENTES */}
      <section className="bg-[#f1f1f1] px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Dúvidas Frequentes
          </h2>
          <div className="mt-8 flex flex-col gap-4">
            {duvidas.map((d, i) => {
              const estaAberto = abertaFaq === i;
              return (
                <div key={d.pergunta} className="rounded-xl bg-white shadow-sm">
                  <button
                    type="button"
                    aria-expanded={estaAberto}
                    onClick={() => setAbertaFaq(estaAberto ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-zinc-800">
                      {d.pergunta}
                    </span>
                    <span className="text-lg text-zinc-500">
                      {estaAberto ? "−" : "+"}
                    </span>
                  </button>
                  {estaAberto && (
                    <p className="px-5 pb-4 text-xs leading-5 text-zinc-500">
                      {d.resposta}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL FELIZ */}
      <section className="bg-white px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Final Feliz de Quem Já Adotou
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {depoimentos.map((d) => (
              <article key={d.nome} className="rounded-2xl bg-[#f8f9fb] p-6">
                <p className="text-sm leading-6 text-zinc-600">{d.texto}</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-zinc-200" />
                  <div>
                    <strong className="block text-xs text-zinc-800">
                      {d.nome}
                    </strong>
                    <span className="text-[10px] text-zinc-500">{d.pet}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {petAberto && (
        <PetDetailsModal
          pet={petAberto}
          onClose={fecharPet}
          onAdopt={irParaFormulario}
        />
      )}
    </>
  );
}