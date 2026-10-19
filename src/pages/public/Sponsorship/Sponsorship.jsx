import { Link } from "react-router-dom";
import PublicFooter from "../../../components/layout/PublicFooter";

// TODO: trocar por dados vindos do back-end quando existir.
// Imagens ficam na pasta public: /images/apadrinhamento/<arquivo>
const beneficios = [
  "Segurança financeira para tratamentos longos",
  "Amor à distância com visitas programadas",
  "Oportunidade de fazer a diferença sem espaço físico",
];

const plano = {
  nome: "Amigo",
  valor: "25",
  itens: [
    "Alimentação",
    "Tratamentos",
    "Atualizações periódicas de bem-estar",
  ],
};

const pets = [
  {
    nome: "Pirata",
    tag: "Cão Idoso",
    descricao:
      "Com 11 anos e apenas um olhinho, precisa de ração especial sênior e exames de rotina.",
    imagem: "/images/apadrinhamento/pirata.jpg",
    soDesktop: false,
  },
  {
    nome: "Fumaça",
    tag: "Gato Diabético",
    descricao:
      "Necessita de aplicação diária de insulina e ração especial úmida de alta qualidade.",
    imagem: "/images/apadrinhamento/fumaca.jpg",
    soDesktop: false,
  },
  {
    nome: "Soneca",
    tag: "Cão em Reabilitação",
    descricao:
      "Sofreu uma fratura e faz fisioterapia para voltar a andar perfeitamente de forma livre.",
    imagem: "/images/apadrinhamento/soneca.jpg",
    soDesktop: true, // não aparece no print mobile
  },
];

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-marca" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

export default function Sponsorship() {
  return (
    <>
      {/* =====================================================
          HERO
      ====================================================== */}
      <section
        className="relative flex min-h-[300px] items-center bg-cover bg-center md:min-h-[340px]"
        style={{ backgroundImage: "url('/images/apadrinhamento/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-14">
          <div className="max-w-xl text-white md:max-w-2xl">
            <h1 className="text-3xl font-extrabold md:text-4xl">
              Apadrinhe um Focinho
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/90 md:text-base">
              Transforme positivamente o tratamento e o dia de um animal sem
              poder trazê-lo para casa.
            </p>
            <a
              href="#planos"
              className="mt-5 hidden rounded-lg bg-marca px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 md:inline-block"
            >
              Ver Planos de Apadrinhamento
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          O QUE É O APADRINHAMENTO
      ====================================================== */}
      <section className="bg-white px-5 py-10 lg:px-14 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-extrabold text-zinc-800 md:text-3xl">
            O que é o Apadrinhamento?
          </h2>
          <p className="mt-2 hidden text-sm text-zinc-500 md:block">
            Uma forma solidária de acolher e sustentar o tratamento de resgatados.
          </p>

          <div className="mt-6 grid gap-8 md:grid-cols-[1.7fr_1fr] md:items-start md:gap-10">
            <div className="flex flex-col gap-5 text-sm leading-7 text-zinc-500">
              <p>
                Muitos animais que estão em nosso abrigo têm histórias
                complexas: são idosos demais, possuem doenças crônicas ou estão
                se recuperando de acidentes graves. Devido a esses cuidados
                especiais, eles costumam demorar muito mais tempo para
                encontrar um lar definitivo.
              </p>
              <p>
                Ao se tornar padrinho ou madrinha, você assume uma contribuição
                financeira mensal que garante ração de qualidade, medicamentos
                contínuos e atendimento veterinário dedicado àquele animal
                específico
                <span className="hidden md:inline">
                  , acompanhando toda a sua jornada de recuperação
                </span>
                .
              </p>
            </div>

            <aside className="rounded-2xl bg-sky-100 p-6">
              <h3 className="text-lg font-bold text-marca">Por que apadrinhar?</h3>
              <ul className="mt-3 flex flex-col gap-2 text-xs leading-5 text-zinc-800 md:text-[13px]">
                {beneficios.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* =====================================================
          PLANOS
      ====================================================== */}
      <section id="planos" className="scroll-mt-4 bg-[#f1f1f1] px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-extrabold text-zinc-800 md:text-center md:text-3xl">
            <span className="md:hidden">Planos de Apadrinhamento</span>
            <span className="hidden md:inline">Apadrinhe um Focinho</span>
          </h2>
          <p className="mt-2 text-sm text-zinc-500 md:text-center">
            Planos mensais estruturados para amparar diferentes perfis de resgatados.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <h3 className="text-xl font-bold text-marca">
              <span className="md:hidden">Plano </span>
              {plano.nome}
            </h3>
            <p className="text-xs text-zinc-500 md:text-sm">A partir de</p>

            <p className="mt-5 flex items-baseline gap-1">
              <strong className="text-4xl font-extrabold text-zinc-900">
                R$ {plano.valor}
              </strong>
              <span className="text-xs text-zinc-500">/mês</span>
            </p>

            <hr className="my-5 border-zinc-200" />

            <ul className="flex flex-col gap-2.5 text-xs text-zinc-700 md:text-[13px]">
              {plano.itens.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>

            {/* TODO: integrar com pagamento/cadastro de padrinhos quando existir.
                Por enquanto leva à página Como Ajudar. */}
            <Link
              to="/como-ajudar"
              className="mt-6 block rounded-lg bg-destaque px-5 py-3 text-center text-sm font-bold text-zinc-900 transition-colors hover:bg-destaque-escura"
            >
              Apadrinhar Agora
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          PELUDINHOS QUE MAIS PRECISAM
      ====================================================== */}
      <section className="bg-white px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-extrabold text-zinc-800 md:text-center md:text-3xl">
            Peludinhos que mais precisam
          </h2>
          <p className="mt-2 text-sm text-zinc-500 md:text-center">
            Eles necessitam de cuidados contínuos de saúde e buscam padrinhos
            ansiosamente.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {pets.map((pet) => (
              <article
                key={pet.nome}
                className={`overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm ${
                  pet.soDesktop ? "hidden md:block" : ""
                }`}
              >
                <div className="p-0">
                  <img
                    src={pet.imagem}
                    alt={pet.nome}
                    className="h-52 w-full object-cover md:h-48"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-zinc-800">{pet.nome}</h3>
                    <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-marca">
                      {pet.tag}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-zinc-500">
                    {pet.descricao}
                  </p>
                  {/* TODO: abrir fluxo de apadrinhamento do animal quando existir */}
                  <Link
                    to="/como-ajudar"
                    className="mt-4 block rounded-lg bg-marca px-4 py-2.5 text-center text-xs font-bold text-white transition hover:opacity-90"
                  >
                    Apadrinhar {pet.nome}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          VOZ DOS PADRINHOS
      ====================================================== */}
      <section className="bg-[#f1f1f1] px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Voz dos Padrinhos
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            A emoção de quem contribui para o reestabelecimento de vidas
            desamparadas.
          </p>

          <article className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm leading-6 text-zinc-800">
              “Apadrinhar o Pirata foi a forma que encontrei de dar amor e
              suporte a um peludo necessitado mesmo não tendo espaço em casa.
              Fico extremamente feliz ao ver o Pirata correndo e recebendo o
              carinho dos cuidadores com a minha ajuda mensal.”
            </p>
            <div className="mt-5 flex items-center gap-3">
              <img
                src="/images/apadrinhamento/claudia.jpg"
                alt=""
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <strong className="block text-sm text-zinc-900">
                  Cláudia Ribeiro
                </strong>
                <span className="text-xs text-zinc-500">
                  Madrinha do Pirata há 1 ano
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}