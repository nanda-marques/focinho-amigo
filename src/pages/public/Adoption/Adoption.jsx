import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PublicFooter from "../../../components/layout/PublicFooter";

// TODO: substituir pelo link real do formulário (Google Forms) da ONG
const LINK_FORMULARIO = "https://forms.google.com/";

const PER_PAGE = 6;

// TODO: trocar por dados vindos do back-end quando existir.
// Imagens seguem o padrão da Home: /images/pets/<nome>.jpg (pasta public)
const pets = [
  { nome: "Amora", tipo: "Cão", sexo: "F", idade: "1 ano", anos: 1, porte: "Grande", tags: [], descricao: "Dócil, super brincalhona e adora crianças. Resgatada de um quintal abandonado.", imagem: "/images/pets/amora.jpg" },
  { nome: "Mingau", tipo: "Gato", sexo: "M", idade: "6 meses", anos: 0, porte: "Pequeno", tags: ["FIV/FELV"], descricao: "Companheiro, adora tirar cochilos no colo e ronrona ao menor toque.", imagem: "/images/pets/mingau.jpg" },
  { nome: "Bobi", tipo: "Cão", sexo: "M", idade: "3 anos", anos: 3, porte: "Médio", tags: [], descricao: "Ativo, protetor e muito esperto. Um excelente companheiro para caminhadas ao ar livre.", imagem: "/images/pets/bobi.jpg" },
  { nome: "Lili", tipo: "Gato", sexo: "F", idade: "2 anos", anos: 2, porte: "Pequeno", tags: ["Diabetes"], descricao: "Calma, independente e elegante. Ideal para apartamentos silenciosos.", imagem: "/images/pets/lili.jpg" },
  { nome: "Toby", tipo: "Cão", sexo: "M", idade: "4 anos", anos: 4, porte: "Médio", tags: ["Surdez Adquirida"], descricao: "Simpático, adora petiscos e passeios calmos. Excelente relacionamento com outros cães.", imagem: "/images/pets/toby.jpg" },
  { nome: "Bela", tipo: "Cão", sexo: "F", idade: "5 anos", anos: 5, porte: "Médio", tags: [], descricao: "Madura, sossegada e carinhosa. Perfeita para quem busca uma companheira tranquila e...", imagem: "/images/pets/bela.jpg" },
];

const passos = [
  { titulo: "Entrevista", texto: 'Bate-papo para entendermos seu perfil, sua rotina e garantir o "match" perfeito com o pet.' },
  { titulo: "Vistoria", texto: "Verificação do ambiente para atestar que o local é seguro e adequado para receber o animal." },
  { titulo: "Proteção", texto: "Para adoção de gatos, é obrigatória a instalação prévia de redes de proteção nas janelas." },
];

const criterios = [
  "Ter idade igual ou superior a 18 anos completos.",
  "Apresentar via impressa do RG, CPF e Comprovante de Residência recente (últimos 3 meses).",
  "Garantir ambiente seguro e telado (no caso de gatinhos ou cães em sobrados).",
  "Assinar o Termo de Responsabilidade e Adoção Consciente no dia de levar o peludinho.",
];

const duvidas = [
  { pergunta: "Quais são os custos da adoção?", resposta: "A adoção na Focinho Amigo é 100% gratuita. No entanto, aceitamos contribuições voluntárias para nos ajudar a continuar resgatando outros amiguinhos que continuam precisando de ajuda médica." },
  { pergunta: "Os animais já vêm prontos para ir para casa?", resposta: "Sim. Todos os nossos pets adultos e jovens são entregues integralmente castrados, vacinados com doses anuais em dia (V10/V12, Antirrábica) e desverminados." },
  { pergunta: "Moro em apartamento, posso adotar?", resposta: "Claro! Muitos dos nossos cãezinhos de médio e pequeno porte e, principalmente, todos os gatinhos se adaptam com maestria a apartamentos, desde que haja telas de proteção e passeios regulares." },
  { pergunta: "E se o pet não se adaptar bem à nova casa?", resposta: "Nós oferecemos suporte pós-adoção com adestradores voluntários parceiros para facilitar a transição. Em último caso, o pet retorna ao abrigo. Nunca o abandone ou repasse sem nossa supervisão." },
];

const depoimentos = [
  { texto: "“A Amora mudou nossas vidas. Todo o processo de adoção da Focinho Amigo foi feito com muita transparência e respeito pelo bem-estar animal. Somos eternamente gratos!”", nome: "Mariana Silva", pet: "Adotou a Amora" },
  { texto: "“O Pipoca era super medroso quando chegou, mas com as instruções da ONG e muito amor, hoje ele corre feliz e confia em todo mundo. Adotar é tudo de bom!”", nome: "Rodrigo Costa", pet: "Adotou o Pipoca" },
];

const filtroTipos = [
  { value: "todos", label: "Todos" },
  { value: "Cão", label: "Cães" },
  { value: "Gato", label: "Gatos" },
];

const selectClass =
  "cursor-pointer bg-transparent text-xs font-bold text-marca focus:outline-none";

function Chip({ children }) {
  return (
    <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
      {children}
    </span>
  );
}

function SelectFiltro({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-zinc-600">
      {label}:
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

export default function Adoption() {
  const [tipo, setTipo] = useState("todos");
  const [porte, setPorte] = useState("todos");
  const [sexo, setSexo] = useState("todos");
  const [idade, setIdade] = useState("todos");
  const [pagina, setPagina] = useState(1);
  const [aberta, setAberta] = useState(null);

  const filtrados = useMemo(
    () =>
      pets.filter((p) => {
        if (tipo !== "todos" && p.tipo !== tipo) return false;
        if (porte !== "todos" && p.porte !== porte) return false;
        if (sexo !== "todos" && p.sexo !== sexo) return false;
        if (idade === "filhote" && p.anos > 1) return false;
        if (idade === "adulto" && (p.anos < 2 || p.anos > 5)) return false;
        if (idade === "idoso" && p.anos < 6) return false;
        return true;
      }),
    [tipo, porte, sexo, idade]
  );

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtrados.slice((paginaAtual - 1) * PER_PAGE, paginaAtual * PER_PAGE);

  const mudar = (setter) => (valor) => {
    setter(valor);
    setPagina(1);
  };

  const pagBtn =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-white";

  return (
    <>
      {/* =====================================================
          HERO
      ====================================================== */}
      <section
        className="relative flex min-h-[260px] items-center bg-cover bg-center md:min-h-[300px]"
        style={{ backgroundImage: "url('/images/adocao/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-14">
          <div className="max-w-xl text-white">
            <h1 className="text-3xl font-extrabold md:text-4xl">Adote um Amigo</h1>
            <p className="mt-3 text-sm leading-6 text-white/90 md:text-base">
              Abra os braços para um carinho sincero e sinta a incomparável
              emoção de salvar e acolher uma vida.
            </p>
            <a
              href="#formulario"
              className="mt-5 block rounded-lg bg-marca px-5 py-3 text-center text-sm font-bold text-white transition hover:opacity-90 md:inline-block"
            >
              <span className="md:hidden">Formulário de Adoção</span>
              <span className="hidden md:inline">Preencher Formulário de Adoção</span>
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          NOSSOS PELUDOS
      ====================================================== */}
      <section className="bg-[#f8f9fb] px-5 py-10 lg:px-14 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-extrabold text-zinc-800 md:text-3xl">Nossos Peludos</h2>
          <p className="mt-2 text-sm text-zinc-500">
            <span className="md:hidden">Exames em dia, castrados e ansiosos por um lar.</span>
            <span className="hidden md:inline">
              Eles estão com exames em dia, vacinados, castrados e esperando ansiosamente por você.
            </span>
          </p>

          {/* Filtros */}
          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:rounded-xl md:border md:border-zinc-200 md:bg-white md:px-4 md:py-3 lg:max-w-[calc(100%-4rem)]">
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
              <SelectFiltro label="Porte" value={porte} onChange={mudar(setPorte)} options={[
                { value: "todos", label: "Qualquer" },
                { value: "Pequeno", label: "Pequeno" },
                { value: "Médio", label: "Médio" },
                { value: "Grande", label: "Grande" },
              ]} />
              <SelectFiltro label="Sexo" value={sexo} onChange={mudar(setSexo)} options={[
                { value: "todos", label: "Qualquer" },
                { value: "F", label: "Fêmea" },
                { value: "M", label: "Macho" },
              ]} />
              <SelectFiltro label="Idade" value={idade} onChange={mudar(setIdade)} options={[
                { value: "todos", label: "Qualquer" },
                { value: "filhote", label: "Até 1 ano" },
                { value: "adulto", label: "2 a 5 anos" },
                { value: "idoso", label: "6 anos ou mais" },
              ]} />
            </div>
          </div>

          {/* Cards */}
          {visiveis.length === 0 ? (
            <p className="mt-10 text-center text-sm text-zinc-500">
              Nenhum animal encontrado com esses filtros.
            </p>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:max-w-[calc(100%-4rem)] lg:grid-cols-3">
              {visiveis.map((pet) => (
                <article key={pet.nome} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                  <img src={pet.imagem} alt={pet.nome} className="h-56 w-full object-cover md:h-48" />
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-zinc-800">{pet.nome}</h3>
                        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-marca">
                          {pet.tipo}
                        </span>
                      </div>
                      <span
                        role="img"
                        aria-label={pet.sexo === "F" ? "Fêmea" : "Macho"}
                        className={`text-base font-bold ${pet.sexo === "F" ? "text-red-500" : "text-marca"}`}
                      >
                        {pet.sexo === "F" ? "♀" : "♂"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Chip>{pet.idade}</Chip>
                      <Chip>Porte {pet.porte}</Chip>
                      {pet.tags.map((t) => <Chip key={t}>{t}</Chip>)}
                    </div>

                    <p className="mt-3 text-xs leading-5 text-zinc-500">{pet.descricao}</p>

                    {/* TODO: levar à página de detalhes do animal quando existir */}
                    <Link
                      to="/adocao"
                      className="mt-4 block rounded-lg bg-marca px-4 py-2.5 text-center text-xs font-bold text-white transition hover:opacity-90"
                    >
                      Conhecer {pet.nome}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Paginação */}
          <nav aria-label="Paginação" className="mt-8 flex items-center justify-center gap-2 lg:max-w-[calc(100%-4rem)]">
            <button type="button" aria-label="Página anterior" disabled={paginaAtual === 1} onClick={() => setPagina(paginaAtual - 1)} className={pagBtn}>‹</button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                aria-current={n === paginaAtual ? "page" : undefined}
                onClick={() => setPagina(n)}
                className={`${pagBtn} ${n === paginaAtual ? "!border-marca !bg-marca text-white hover:!bg-marca" : ""}`}
              >
                {n}
              </button>
            ))}
            <button type="button" aria-label="Próxima página" disabled={paginaAtual === totalPaginas} onClick={() => setPagina(paginaAtual + 1)} className={pagBtn}>›</button>
          </nav>
        </div>
      </section>

      {/* =====================================================
          3 PASSOS
      ====================================================== */}
      <section className="bg-white px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-zinc-800 md:text-3xl">
            3 Passos Simples para Adotar
          </h2>
          <p className="mt-2 hidden text-center text-sm text-zinc-500 md:block">
            Como funciona o nosso processo consciente de união familiar.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
            {passos.map((p, i) => (
              <article key={p.titulo} className="rounded-2xl bg-[#f8f9fb] p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-marca font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-bold text-zinc-800">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{p.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CRITÉRIOS
      ====================================================== */}
      <section className="bg-[#f1f1f1] px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Critérios Essenciais para a Adoção
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            O que você precisa reunir e comprovar para o dia especial.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {criterios.map((c) => (
              <li key={c} className="flex items-start gap-3 text-sm text-zinc-800">
                <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destaque text-[11px] font-bold text-zinc-900">
                  ✓
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =====================================================
          FORMULÁRIO
      ====================================================== */}
      <section id="formulario" className="scroll-mt-4 bg-white px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Inicie seu Processo de Adoção
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Preencha o formulário eletrônico oficial diretamente no espaço seguro abaixo.
          </p>
          <div className="mt-8 flex flex-col items-center rounded-xl border-2 border-dashed border-marca px-5 py-12 text-center md:py-16">
            <span aria-hidden="true" className="text-3xl text-marca">▤</span>
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

      {/* =====================================================
          DÚVIDAS FREQUENTES
      ====================================================== */}
      <section className="bg-[#f1f1f1] px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Dúvidas Frequentes
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Perguntas comuns e respostas honestas para ajudar no seu planejamento.
          </p>
          <div className="mt-8 flex flex-col gap-4">
            {duvidas.map((d, i) => {
              const aberto = aberta === i;
              return (
                <div key={d.pergunta} className="rounded-xl bg-white shadow-sm">
                  <button
                    type="button"
                    aria-expanded={aberto}
                    onClick={() => setAberta(aberto ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-zinc-800">{d.pergunta}</span>
                    <span aria-hidden="true" className="text-lg text-zinc-500">{aberto ? "−" : "+"}</span>
                  </button>
                  {aberto && (
                    <p className="px-5 pb-4 text-xs leading-5 text-zinc-500">{d.resposta}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL FELIZ
      ====================================================== */}
      <section className="bg-white px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Final Feliz de Quem Já Adotou
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Histórias de superação e lares que se completaram com muito carinho.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {depoimentos.map((d) => (
              <article key={d.nome} className="rounded-2xl bg-[#f8f9fb] p-6">
                <p className="text-sm leading-6 text-zinc-600">{d.texto}</p>
                <div className="mt-5 flex items-center gap-3">
                  {/* TODO: trocar pelo avatar real de cada tutor */}
                  <div className="h-9 w-9 rounded-full bg-zinc-200" />
                  <div>
                    <strong className="block text-xs text-zinc-800">{d.nome}</strong>
                    <span className="text-[10px] text-zinc-500">{d.pet}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}
