import { Link } from "react-router-dom";
import PublicFooter from "../../../components/layout/PublicFooter";

// Imagens ficam na pasta public: /images/sobre-nos/<arquivo>

const iconProps = {
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  className: "h-5 w-5",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const IconeCoracao = () => (
  <svg {...iconProps}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

const IconeOlho = () => (
  <svg {...iconProps}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconeEscudo = () => (
  <svg {...iconProps}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const pilares = [
  {
    titulo: "Prevenção e Conscientização",
    texto:
      "Promovemos campanhas e eventos para impedir maus-tratos e estimular o amor e o respeito aos animais, além de acompanhar a legislação de proteção animal.",
    textoMobile:
      "Promovemos campanhas e eventos para impedir maus-tratos e estimular o amor e o respeito aos animais.",
    Icone: IconeCoracao,
  },
  {
    titulo: "Assistência Social e Veterinária",
    texto:
      "Oferecemos assistência médico-veterinária e campanhas de castração também para famílias de baixa renda, além do tratamento dos animais resgatados.",
    textoMobile:
      "Oferecemos assistência médico-veterinária e campanhas de castração também para famílias de baixa renda.",
    Icone: IconeOlho,
  },
  {
    titulo: "Rede de Apoio",
    texto:
      "Apoiamos outros abrigos e ONGs que recolhem e cuidam de animais abandonados, com o trabalho de 35 voluntários.",
    Icone: IconeEscudo,
  },
];

const marcos = [
  {
    ano: "2018",
    titulo: "Fundação",
    texto:
      "A Organização da Sociedade Civil de Interesse Público Focinho Amigo Indaiatuba começou como um grupo de proteção em 29 de junho de 2018.",
  },
  {
    ano: "2020",
    titulo: "Formalização",
    texto:
      "Nos formalizamos como OSCIP e também assumimos nossa primeira sede onde também funciona um bazar que hoje é 80% da nossa renda.",
  },
  {
    ano: "2026",
    titulo: "20k seguidores no Instagram",
    texto:
      "Cada pessoa que está aqui faz parte disso. Cada curtida, cada compartilhamento, cada apoio — tudo isso ajuda nossos resgates, nossas adoções e os animais que precisam.",
  },
  {
    ano: "2026",
    titulo: "Atualmente",
    texto:
      "Hoje contamos com 35 voluntários e 2 funcionários dedicados a cuidar de cerca de 50 cães e gatos entre hotel e lares temporários.",
  },
];

const equipe = [
  { nome: "Dra. Beatriz Lima", cargo: "Veterinária Chefe", imagem: "/images/sobre-nos/beatriz.jpg" },
  { nome: "Carlos Eduardo", cargo: "Coordenador de Resgates", imagem: "/images/sobre-nos/carlos.jpg" },
  { nome: "Gabriela Santos", cargo: "Comunicação & Eventos", imagem: "/images/sobre-nos/gabriela.jpg" },
  { nome: "Luciana Rocha", cargo: "Cuidadora Especialista", imagem: "/images/sobre-nos/luciana.jpg" },
];

export default function About() {
  return (
    <>
      {/* =====================================================
          HERO
      ====================================================== */}
      <section
        className="relative flex min-h-[220px] items-center bg-cover bg-center md:min-h-[290px]"
        style={{ backgroundImage: "url('/images/sobre-nos/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 lg:px-14">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl font-extrabold md:text-4xl">Nossa História</h1>
            <p className="mt-3 text-sm leading-6 text-white/90 md:text-base">
              Nossa visão é criar um mundo sem abandono e maus-tratos.
              Temos o objetivo de resgatar, reabilitar e encaminhar para adoção
              animais retirados das ruas e de situações de maus-tratos
              <span className="hidden md:inline">
                , além de ajudar famílias carentes com assistência veterinária
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          NOSSOS PILARES
      ====================================================== */}
      <section className="bg-white px-5 py-10 lg:px-14 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Nossos Pilares
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            A conduta e os ideais que guiam cada passo da nossa associação protetora.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3 md:items-start md:gap-5">
            {pilares.map(({ titulo, texto, textoMobile, Icone }) => (
              <article
                key={titulo}
                className="rounded-2xl border border-zinc-200 bg-[#f8f9fb] p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-marca text-white">
                  <Icone />
                </div>
                <h3 className="mt-4 text-lg font-bold text-zinc-800">{titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500 md:text-xs md:leading-5">
                  {textoMobile ? (
                    <>
                      <span className="md:hidden">{textoMobile}</span>
                      <span className="hidden md:inline">{texto}</span>
                    </>
                  ) : (
                    texto
                  )}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          LINHA DO TEMPO
      ====================================================== */}
      <section className="bg-[#f1f1f1] px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Linha do Tempo
          </h2>
          <p className="mt-2 hidden text-center text-sm text-zinc-500 md:block">
            Principais marcos e conquistas desde o início da nossa jornada.
          </p>

          {/* Mobile: cards empilhados. Desktop: zigue-zague com conectores. */}
          <ol className="mx-auto mt-8 flex max-w-3xl flex-col gap-4 md:mt-10 md:gap-12">
            {marcos.map((m, i) => {
              const direita = i % 2 === 1;
              const temProximo = i < marcos.length - 1;
              return (
                <li
                  key={m.titulo}
                  className={`relative md:w-[46%] ${direita ? "md:ml-auto" : ""}`}
                >
                  <div className="relative z-10 rounded-xl bg-white p-5 shadow-sm">
                    <span className="text-sm font-bold text-marca">{m.ano}</span>
                    <h3 className="mt-1 text-lg font-bold text-zinc-800">{m.titulo}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-500 md:text-xs md:leading-5">
                      {m.texto}
                    </p>
                  </div>

                  {temProximo && (
                    <span
                      aria-hidden="true"
                      className={`absolute top-full hidden h-[7rem] w-[67%] md:block ${
                        direita
                          ? "right-[50%] rounded-bl-none border-b-2 border-r-2 border-marca"
                          : "left-[50%] border-b-2 border-l-2 border-marca"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* =====================================================
          QUEM FAZ ACONTECER
      ====================================================== */}
      <section className="bg-white px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Quem Faz Acontecer
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Nossos dedicados heróis que doam amor e cuidado diário aos peludinhos.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {equipe.map((p) => (
              <article
                key={p.nome}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
              >
                <img
                  src={p.imagem}
                  alt={p.nome}
                  className="h-40 w-full object-cover md:h-52"
                />
                <div className="p-3 md:p-4">
                  <h3 className="text-sm font-bold text-zinc-800 md:text-base">{p.nome}</h3>
                  <p className="mt-0.5 text-[11px] font-semibold text-marca md:text-xs">
                    {p.cargo}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA VOLUNTARIADO
      ====================================================== */}
      <section className="bg-marca px-5 py-12 text-center text-white lg:px-14 lg:py-14">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-extrabold md:text-3xl">Faça parte dessa história</h2>
          <p className="mt-3 text-sm leading-6 text-white/90">
            Doar seu tempo e suas habilidades é uma das formas mais bonitas de
            mudar vidas. Temos vagas para voluntários de limpeza, cuidados
            veterinários, eventos, redes sociais e muito mais. Venha somar com
            a gente!
          </p>
          <Link
            to="/voluntariado"
            className="mt-6 block rounded-lg bg-destaque px-6 py-3 text-sm font-bold text-zinc-900 transition-colors hover:bg-destaque-escura md:inline-block"
          >
            <span className="md:hidden">Quero me Candidatar</span>
            <span className="hidden md:inline">Quero me Candidatar como Voluntário</span>
          </Link>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}
