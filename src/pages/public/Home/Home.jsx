import { Link } from "react-router-dom";

const pets = [
  {
    nome: "Mel",
    especie: "Vira-lata",
    idade: "2 anos",
    imagem: "src/assets/images/pets/mel.png",
  },
  {
    nome: "Simba",
    especie: "Siamês Mix",
    idade: "1 ano",
    imagem: "src/assets/images/pets/simba.png",
  },
  {
    nome: "Barney",
    especie: "Basset Mix",
    idade: "4 anos",
    imagem: "src/assets/images/pets/barney.png",
  },
];

const formasAjuda = [
  {
    titulo: "Adoção",
    texto:
      "Abra as portas da sua casa e mude para sempre o destino de um animal resgatado.",
    link: "/adocao",
    icone: "⌂",
    destaque: false,
  },
  {
    titulo: "Apadrinhamento",
    texto:
      "Ajude com os custos de alimentação e tratamento médico de um cão ou gato sem adotá-lo.",
    link: "/apadrinhamento",
    icone: "♡",
    destaque: false,
  },
  {
    titulo: "Voluntariado",
    texto:
      "Doe seu tempo e carinho participando de ações, banhos e feiras de adoção.",
    link: "/voluntariado",
    icone: "♧",
    destaque: false,
  },
  {
    titulo: "Doação",
    texto:
      "Qualquer valor faz a diferença na compra de medicamentos, ração e manutenção do abrigo.",
    link: "/como-ajudar",
    icone: "▣",
    destaque: true,
  },
];

export default function Home() {
  return (
    <main>

      {/* =====================================================
          HERO
      ====================================================== */}
      <section
        className="relative flex min-h-[430px] items-center bg-cover bg-center"
        style={{
          backgroundImage: "url('src/assets/hero/hero.png')",
        }}
      >
        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-14">
          <div className="max-w-xl text-white">

            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Cada focinho merece um
              <br />
              lar cheio de amor
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-6 text-white/90 md:text-base">
              A Focinho Amigo resgata, cuida e encontra famílias
              definitivas para animais abandonados. Junte-se a nós
              nesta missão de salvar vidas.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/adocao"
                className="rounded-lg bg-marca px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                Quero Adotar
              </Link>

              <Link
                to="/como-ajudar"
                className="rounded-lg bg-destaque px-5 py-3 text-sm font-bold text-zinc-900 transition hover:bg-destaque-escura"
              >
                Quero Ajudar
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          CAMPANHA URGENTE
      ====================================================== */}
      <section className="bg-white px-5 py-10 lg:px-14">
        <div className="mx-auto max-w-6xl">

          <div className="grid overflow-hidden rounded-2xl border border-destaque bg-[#fffdf3] md:grid-cols-[280px_1fr]">

            <img
              src="src/assets/images/pets/rex.png"
              alt="Rex"
              className="h-full min-h-[190px] w-full object-cover"
            />

            <div className="flex flex-col justify-center p-6 md:p-8">

              <span className="w-fit rounded-full bg-destaque/20 px-3 py-1 text-[10px] font-bold uppercase text-destaque-escura">
                Campanha urgente
              </span>

              <h2 className="mt-3 text-2xl font-extrabold text-zinc-800">
                Ajude o Rex! Ele precisa de uma cirurgia.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-5 text-zinc-500">
                O Rex foi resgatado com uma fratura complexa no quadril
                após sofrer um atropelamento. Precisamos arrecadar o valor
                do procedimento cirúrgico ortopédico e os custos
                pós-operatórios para que ele volte a correr alegremente.
              </p>

              <Link
                to="/como-ajudar"
                className="mt-5 w-fit rounded-lg bg-marca px-5 py-3 text-xs font-bold text-white"
              >
                Contribuir Agora
              </Link>

            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
          PETS
      ====================================================== */}
      <section className="bg-[#f1f1f1] px-5 py-16 lg:px-14">
        <div className="mx-auto max-w-7xl">

          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-zinc-800">
                Conheça nossos pets
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Eles estão vacinados, castrados e ansiosos para espalhar
                alegria no seu lar.
              </p>
            </div>

            <Link
              to="/adocao"
              className="hidden text-xs font-semibold text-marca md:block"
            >
              Procure por espécie ↓
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">

            {pets.map((pet) => (
              <article
                key={pet.nome}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <img
                  src={pet.imagem}
                  alt={pet.nome}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">

                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-zinc-800">
                      {pet.nome}
                    </h3>

                    <button
                      type="button"
                      aria-label={`Favoritar ${pet.nome}`}
                      className="text-destaque"
                    >
                      ♡
                    </button>
                  </div>

                  <div className="mt-2 flex gap-2">
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-[9px] text-zinc-600">
                      {pet.especie}
                    </span>

                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] text-blue-600">
                      {pet.idade}
                    </span>
                  </div>

                  <Link
                    to="/adocao"
                    className="mt-4 block rounded-lg bg-marca px-4 py-2.5 text-center text-xs font-bold text-white"
                  >
                    Conhecer {pet.nome}
                  </Link>

                </div>
              </article>
            ))}

          </div>

          <div className="mt-8 text-center">
            <Link
              to="/adocao"
              className="text-xs font-bold text-marca"
            >
              Ver todos os animais →
            </Link>
          </div>

        </div>
      </section>

      {/* =====================================================
          SOBRE
      ====================================================== */}
      <section className="bg-white px-5 py-16 lg:px-14">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">

          <img
            src="src/assets/images/equipe.png"
            alt="Equipe do Focinho Amigo com animais resgatados"
            className="h-[320px] w-full rounded-2xl object-cover"
          />

          <div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase text-marca">
              Quem somos
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-zinc-800">
              O trabalho por trás de cada recomeço feliz
            </h2>

            <p className="mt-4 text-sm leading-6 text-zinc-500">
              Fundada em 2018, a Focinho Amigo nasceu do sonho de
              mudar a realidade de cães e gatos desamparados no Brasil.
              Nós acreditamos que a compaixão e o respeito pelos animais
              transformam toda a sociedade.
            </p>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Oferecemos atendimento veterinário de qualidade,
              abrigo seguro, alimentação, apoio psicológico e,
              acima de tudo, o encaminhamento responsável para
              lares acolhedores.
            </p>

            <Link
              to="/sobre-nos"
              className="mt-5 inline-block rounded-lg bg-marca px-5 py-3 text-xs font-bold text-white"
            >
              Conheça nossa história
            </Link>

          </div>
        </div>
      </section>

      {/* =====================================================
          NÚMEROS
      ====================================================== */}
      <section className="bg-marca px-5 py-10 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center md:grid-cols-4">

          <div>
            <strong className="text-3xl font-extrabold text-destaque">
              +500
            </strong>
            <p className="mt-1 text-xs">
              Animais Resgatados
            </p>
          </div>

          <div>
            <strong className="text-3xl font-extrabold text-destaque">
              +350
            </strong>
            <p className="mt-1 text-xs">
              Adoções Realizadas
            </p>
          </div>

          <div>
            <strong className="text-3xl font-extrabold text-destaque">
              +120
            </strong>
            <p className="mt-1 text-xs">
              Voluntários Ativos
            </p>
          </div>

          <div>
            <strong className="text-3xl font-extrabold text-destaque">
              +80
            </strong>
            <p className="mt-1 text-xs">
              Apadrinhamentos
            </p>
          </div>

        </div>
      </section>

      {/* =====================================================
          DEPOIMENTOS
      ====================================================== */}
      <section className="bg-[#f1f1f1] px-5 py-16 lg:px-14">
        <div className="mx-auto max-w-6xl">

          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-zinc-800">
              Histórias de Quem Adotou
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              A maior recompensa para o nosso coração é ver as famílias se completando.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">

            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-destaque">
                ★★★★★
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-600">
                “A Amora mudou nossas vidas. Todo o processo de
                adoção da Focinho Amigo foi feito com muita
                transparência e respeito pelo bem-estar animal.”
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-zinc-200" />

                <div>
                  <strong className="block text-xs text-zinc-800">
                    Mariana Silva
                  </strong>

                  <span className="text-[10px] text-zinc-500">
                    Adotou a Amora
                  </span>
                </div>
              </div>
            </article>

            <article className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-destaque">
                ★★★★★
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-600">
                “O Pipoca era super medroso quando chegou, mas
                com as instruções da ONG e muito amor, hoje ele
                corre feliz e confia em todo mundo.”
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-zinc-200" />

                <div>
                  <strong className="block text-xs text-zinc-800">
                    Rodrigo Costa
                  </strong>

                  <span className="text-[10px] text-zinc-500">
                    Adotou o Pipoca
                  </span>
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* =====================================================
          COMO AJUDAR
      ====================================================== */}
      <section className="bg-white px-5 py-16 lg:px-14">
        <div className="mx-auto max-w-7xl">

          <h2 className="text-2xl font-extrabold text-zinc-800">
            Como Você Pode Ajudar
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Existem várias formas de transformar a vida dos nossos
            resgatados. Escolha a que mais toca seu coração.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">

            {formasAjuda.map((item) => (
              <article
                key={item.titulo}
                className="rounded-2xl bg-[#f1f1f1] p-5 transition hover:-translate-y-1 hover:shadow-md"
              >

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-lg text-white ${
                    item.destaque
                      ? "bg-destaque text-zinc-900"
                      : "bg-marca"
                  }`}
                >
                  {item.icone}
                </div>

                <h3 className="mt-4 font-bold text-zinc-800">
                  {item.titulo}
                </h3>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  {item.texto}
                </p>

                <Link
                  to={item.link}
                  className="mt-4 inline-block text-[10px] font-bold text-marca"
                >
                  Saiba Mais →
                </Link>

              </article>
            ))}

          </div>
        </div>
      </section>

      {/* =====================================================
          PARCEIROS
      ====================================================== */}
      <section className="bg-[#f1f1f1] px-5 py-10 lg:px-14">
        <div className="mx-auto max-w-6xl">

          <p className="text-center text-[10px] font-bold uppercase tracking-wide text-zinc-500">
            Nossos parceiros & apoiadores
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-6">

            {[
              "VetCare",
              "PetShop Petz",
              "Amor Animal",
              "NutriPet",
              "DogRoom",
              "PataSegura",
            ].map((parceiro) => (
              <div
                key={parceiro}
                className="flex h-10 items-center justify-center rounded-lg bg-white px-3 text-[10px] font-semibold text-zinc-400"
              >
                ♢ {parceiro}
              </div>
            ))}

          </div>
        </div>
      </section>

    </main>
  );
}