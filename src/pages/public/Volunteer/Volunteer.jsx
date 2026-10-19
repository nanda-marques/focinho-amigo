import PublicFooter from "../../../components/layout/PublicFooter";
import {
  IconCheck,
  IconDoc,
  IconHeart,
  IconStar,
  IconUsers,
} from "../../../components/layout/Icons";

// TODO: substituir pelo link real do formulário de voluntários (Google Forms)
const LINK_FORMULARIO_VOLUNTARIO = "https://forms.google.com/";

// Imagens ficam na pasta public: /images/voluntariado/<arquivo>
const motivos = [
  { titulo: "Transforme Vidas", texto: "Ofereça carinho e reabilitação direta para animais que sofreram traumas, preparando-os para adoção.", Icone: IconHeart },
  { titulo: "Aprenda e Cresça", texto: "Adquira experiência prática com cuidados veterinários básicos, socialização animal e gestão de eventos.", Icone: IconStar },
  { titulo: "Faça Amigos", texto: "Conecte-se com uma comunidade incrível de protetores, amantes de bichinhos e profissionais dedicados.", Icone: IconUsers, destaque: true },
];

const areas = [
  { n: "01", titulo: "Cuidados com Animais", texto: "Ajude a dar banho, passear, escovar os pelos e dar carinho diário para que eles se sintam acolhidos e amados." },
  { n: "02", titulo: "Eventos e Feiras", texto: "Auxilie na montagem das nossas feiras de adoção, divulgação de brindes e acolhimento dos candidatos a adotantes." },
  { n: "03", titulo: "Comunicação e Redes", texto: "Ajude tirando fotos profissionais, produzindo textos de histórias dos pets ou gerindo nossas postagens nas redes sociais." },
  { n: "04", titulo: "Transporte Solidário", texto: "Leve animais resgatados a consultas de rotina clínicas veterinárias ou entregue doações arrecadadas no abrigo." },
];

const requisitos = [
  "Ter idade igual ou superior a 18 anos",
  "Disponibilidade mínima de 4 horas mensais",
  "Participar do treinamento introdutório obrigatório",
];

export default function Volunteer() {
  return (
    <>
      {/* =====================================================
          HERO
      ====================================================== */}
      <section
        className="relative flex min-h-[260px] items-center bg-cover bg-center md:min-h-[300px]"
        style={{ backgroundImage: "url('/images/voluntariado/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 lg:px-14">
          <div className="max-w-xl text-white md:max-w-2xl">
            <h1 className="text-3xl font-extrabold md:text-4xl">Seja um Voluntário</h1>
            <p className="mt-3 text-sm leading-6 text-white/90 md:text-base">
              Mude a realidade de centenas de patinhas. Doe seu tempo, carinho e
              dedicação para guiar animais abandonados rumo a um novo recomeço
              cheio de amor.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          POR QUE SER VOLUNTÁRIO
      ====================================================== */}
      <section className="bg-white px-5 py-10 lg:px-14 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Por que ser voluntário?
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Mais do que ajudar o abrigo, o voluntariado transforma a sua própria
            visão de compaixão e união.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
            {motivos.map(({ titulo, texto, Icone, destaque }) => (
              <article key={titulo} className="rounded-2xl bg-[#f1f1f1] p-6">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${
                    destaque ? "bg-destaque text-zinc-900" : "bg-marca text-white"
                  }`}
                >
                  <Icone className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-zinc-800">{titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500 md:text-xs md:leading-5">
                  {texto}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          ÁREAS DE ATUAÇÃO
      ====================================================== */}
      <section className="bg-[#f1f1f1] px-5 py-10 lg:px-14 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-extrabold text-zinc-800 md:text-3xl">Áreas de Atuação</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Você pode ajudar de várias formas. Escolha o segmento que melhor
            combina com suas habilidades.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2 md:gap-4 lg:max-w-[90%]">
            {areas.map((a) => (
              <article key={a.n} className="flex items-start gap-4 rounded-xl bg-white p-4 md:items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-marca">
                  {a.n}
                </span>
                <div>
                  <h3 className="font-bold text-zinc-800">{a.titulo}</h3>
                  <p className="mt-1 text-sm leading-5 text-zinc-500 md:text-xs">{a.texto}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          O QUE VOCÊ PRECISA PARA COMEÇAR
      ====================================================== */}
      <section className="bg-white px-5 py-10 lg:px-14 lg:py-14">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-[10px] font-bold uppercase text-marca">
              Requisitos básicos
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-zinc-800 md:text-3xl">
              O que você precisa para começar?
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Buscamos voluntários comprometidos, com paixão pela causa animal.
              Veja as condições mínimas de adesão para nossos mutirões.
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {requisitos.map((r) => (
                <li key={r} className="flex items-center gap-3 text-sm font-bold text-zinc-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-marca">
                    <IconCheck className="h-3 w-3" />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <img
            src="/images/voluntariado/comecar.jpg"
            alt="Voluntária abraçando um cachorro"
            className="h-64 w-full rounded-3xl object-cover md:h-[270px]"
          />
        </div>
      </section>

      {/* =====================================================
          FORMULÁRIO
      ====================================================== */}
      <section className="bg-white px-5 pb-12 lg:px-14 lg:pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-marca bg-[#f8f9fb] px-5 py-10 text-center md:py-14">
            <IconDoc className="h-8 w-8 text-marca" />
            <h2 className="mt-3 text-lg font-bold text-zinc-800">
              <span className="md:hidden">Inscrição de Voluntários</span>
              <span className="hidden md:inline">Formulário de Inscrição (Google Forms)</span>
            </h2>
            <p className="mt-1 max-w-xs text-xs text-zinc-500 md:max-w-none">
              Preencha seus dados de contato e interesses de voluntariado
              diretamente pelo formulário integrado.
            </p>
            <a
              href={LINK_FORMULARIO_VOLUNTARIO}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 w-full rounded-lg bg-marca px-6 py-2.5 text-center text-xs font-bold text-white transition hover:opacity-90 md:w-auto"
            >
              Abrir em Nova Aba
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          VOZ DE QUEM NOS APOIA
      ====================================================== */}
      <section className="bg-[#f1f1f1] px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Voz de Quem Nos Apoia
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Veja a experiência de quem já faz parte desse time de amor.
          </p>

          <article className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm leading-6 text-zinc-800">
              “Comecei como voluntária nas feiras de adoção e hoje auxilio
              também no resgate. É indescritível a alegria de ver um animal que
              chegou assustado e machucado sair do abrigo abanando o rabo com
              seus novos donos.”
            </p>
            <div className="mt-5 flex items-center gap-3">
              <img
                src="/images/voluntariado/beatriz.jpg"
                alt=""
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <strong className="block text-sm text-zinc-900">Beatriz Souza</strong>
                <span className="text-xs text-zinc-500">Voluntária desde 2021</span>
              </div>
            </div>
          </article>
        </div>
      </section>

    </>
  );
}
