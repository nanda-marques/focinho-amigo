import { useState } from "react";
import PublicFooter from "../../../components/layout/PublicFooter";
import {
  IconArrowRight,
  IconChevronDown,
  IconClock,
  IconInstagram,
  IconMail,
  IconPin,
  IconWhatsApp,

} from "../../../components/layout/Icons";

const EMAIL = "focinhoamigoindaiatuba@gmail.com";
const WHATSAPP_EXIBIDO = "+55 (19) 989765972";
const WHATSAPP_LINK = "https://wa.me/5519989765972";
const INSTAGRAM_USER = "@focinhoamigoindaiatuba";
const INSTAGRAM_LINK = "https://www.instagram.com/focinhoamigoindaiatuba/";
const ENDERECO = "Rua Nove de Julho, 1399 - Vila Georgina";
const CONSULTA_MAPA = "Rua Nove de Julho, 1399, Indaiatuba - SP";
const MAPA_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(CONSULTA_MAPA)}&output=embed`;
const MAPA_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONSULTA_MAPA)}`;

// Imagens ficam na pasta public: /images/contato/<arquivo>
const faq = [
  { pergunta: "Qualquer pessoa pode visitar o abrigo?", resposta: "Sim! As visitas são abertas ao público todos os sábados e domingos das 13h às 17h. Não é necessário agendamento prévio para visitas simples de socialização." },
  { pergunta: "Quais documentos preciso para adotar um cão ou gato?", resposta: "Você deve apresentar um documento oficial com foto (RG/CNH), comprovante de residência atualizado e passar por uma breve entrevista presencial de compatibilidade com o pet." },
  { pergunta: "Como posso acompanhar a prestação de contas das doações?", resposta: "Todas as doações financeiras recebidas via banco ou PIX são auditadas. Publicamos demonstrativos mensais com notas fiscais de gastos diretamente na nossa seção de transparência institucional." },
];

const campo =
  "w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-marca focus:outline-none focus:ring-1 focus:ring-marca";

function Canal({ rotulo, valor, href, icone, destaque }) {
  const conteudo = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full">{icone}</span>
      <span className="min-w-0">
        <span className={`block text-[10px] font-bold uppercase ${destaque ? "text-amber-700" : "text-marca"}`}>
          {rotulo}
        </span>
        <span className="block break-words text-sm font-bold text-zinc-900">{valor}</span>
      </span>
    </>
  );
  const classe = "flex items-center gap-4 rounded-xl bg-[#f8f9fb] px-4 py-3.5";
  if (!href) return <div className={classe}>{conteudo}</div>;
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={`${classe} transition-colors hover:bg-slate-100`}>
      {conteudo}
    </a>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" });
  const [abertas, setAbertas] = useState(() => new Set(faq.map((_, i) => i)));

  const atualizar = (campoNome) => (e) => setForm({ ...form, [campoNome]: e.target.value });

  const alternar = (i) =>
    setAbertas((atual) => {
      const novo = new Set(atual);
      novo.has(i) ? novo.delete(i) : novo.add(i);
      return novo;
    });

  // TODO: ligar a um endpoint do back-end quando existir.
  // Por enquanto abre o e-mail do visitante já preenchido para a ONG.
  const enviar = (e) => {
    e.preventDefault();
    const corpo = [
      `Nome: ${form.nome}`,
      `E-mail: ${form.email}`,
      `Telefone: ${form.telefone}`,
      "",
      form.mensagem,
    ].join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(form.assunto || "Contato pelo site")}&body=${encodeURIComponent(corpo)}`;
  };

  return (
    <>
      {/* =====================================================
          HERO
      ====================================================== */}
      <section
        className="relative flex min-h-[230px] items-center bg-cover bg-center md:min-h-[345px]"
        style={{ backgroundImage: "url('/images/contato/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 lg:px-14">
          <div className="max-w-xl text-white md:max-w-3xl">
            <h1 className="text-3xl font-extrabold md:text-4xl">Fale Conosco</h1>
            <p className="mt-3 text-sm leading-6 text-white/90 md:text-base">
              Tem dúvidas sobre o processo de adoção, doações ou quer agendar
              uma visita? Nossa equipe está de braços abertos para te ouvir.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CANAIS + FORMULÁRIO
      ====================================================== */}
      <section className="bg-white px-5 py-10 lg:px-14 lg:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.25fr] lg:gap-10">
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-800 md:text-3xl">Canais de Atendimento</h2>
            <div className="mt-5 flex flex-col gap-3">
              <Canal
                rotulo="WhatsApp"
                valor={WHATSAPP_EXIBIDO}
                href={WHATSAPP_LINK}
                icone={<span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white"><IconWhatsApp className="h-5 w-5" /></span>}
              />
              <Canal
                rotulo="E-mail"
                valor={EMAIL}
                href={`mailto:${EMAIL}`}
                icone={<span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-marca"><IconMail className="h-4 w-4" /></span>}
              />
              <Canal
                rotulo="Instagram"
                valor={INSTAGRAM_USER}
                href={INSTAGRAM_LINK}
                icone={<span className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 text-white"><IconInstagram className="h-4 w-4" /></span>}
              />
              <Canal
                rotulo="Endereço do Abrigo"
                valor={ENDERECO}
                href={MAPA_LINK}
                icone={<span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-marca"><IconPin className="h-4 w-4" /></span>}
              />

              <div className="flex items-center gap-4 rounded-xl border border-destaque bg-amber-50 px-4 py-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destaque text-zinc-900">
                  <IconClock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase text-amber-700">Horário de Funcionamento</p>
                  <p className="text-sm font-bold text-zinc-900">Segunda a sexta: 13:00 às 17:00</p>
                  <p className="text-sm font-bold text-zinc-900">Sábado: 9:00 às 12:00</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={enviar} className="rounded-2xl bg-[#f8f9fb] p-6 md:p-8">
            <h2 className="text-xl font-extrabold text-zinc-800 md:text-2xl">Envie uma Mensagem</h2>
            <p className="mt-1 text-sm text-zinc-500">Retornamos seu contato em até 48 horas úteis.</p>

            <div className="mt-5 flex flex-col gap-4">
              <label className="block text-xs font-bold text-zinc-700">
                Nome Completo
                <input required type="text" value={form.nome} onChange={atualizar("nome")} placeholder="Seu nome completo" className={`${campo} mt-1.5 font-normal`} />
              </label>
              <label className="block text-xs font-bold text-zinc-700">
                E-mail
                <input required type="email" value={form.email} onChange={atualizar("email")} placeholder="voce@exemplo.com" className={`${campo} mt-1.5 font-normal`} />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-xs font-bold text-zinc-700">
                  Telefone
                  <input type="tel" value={form.telefone} onChange={atualizar("telefone")} placeholder="(41) 99999-9999" className={`${campo} mt-1.5 font-normal`} />
                </label>
                <label className="block text-xs font-bold text-zinc-700">
                  Assunto
                  <input type="text" value={form.assunto} onChange={atualizar("assunto")} placeholder="Ex: Quero Adotar" className={`${campo} mt-1.5 font-normal`} />
                </label>
              </div>
              <label className="block text-xs font-bold text-zinc-700">
                Mensagem
                <textarea required rows={4} value={form.mensagem} onChange={atualizar("mensagem")} placeholder="Escreva sua mensagem aqui detalhadamente..." className={`${campo} mt-1.5 resize-none font-normal`} />
              </label>
              <button type="submit" className="rounded-lg bg-marca px-5 py-3 text-sm font-bold text-white transition hover:opacity-90">
                Enviar Mensagem
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* =====================================================
          MAPA
      ====================================================== */}
      <section className="bg-white px-5 pb-12 lg:px-14 lg:pb-16">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <iframe
            title="Mapa do abrigo Focinho Amigo"
            src={MAPA_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[260px] w-full border-0 md:h-[345px]"
          />
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 bg-white p-4 md:absolute md:left-5 md:top-5 md:rounded-xl md:py-3 md:shadow-md">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <strong className="text-sm text-zinc-900">Como Chegar no Abrigo</strong>
              <span className="text-xs text-zinc-600">{ENDERECO}</span>
            </div>
            <a href={MAPA_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold text-marca hover:underline">
              Abrir no Google Maps
              <IconArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          PERGUNTAS FREQUENTES
      ====================================================== */}
      <section className="bg-[#f1f1f1] px-5 py-12 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-zinc-800 md:text-3xl">Perguntas Frequentes</h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Tudo o que você precisa saber antes de nos mandar um oi.
          </p>
          <div className="mt-8 flex flex-col gap-4">
            {faq.map((item, i) => {
              const aberto = abertas.has(i);
              return (
                <div key={item.pergunta} className="rounded-xl bg-white px-5 py-4 shadow-sm">
                  <button type="button" aria-expanded={aberto} onClick={() => alternar(i)} className="flex w-full items-start justify-between gap-4 text-left">
                    <span className="text-sm font-bold text-zinc-900">{item.pergunta}</span>
                    <IconChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-marca transition-transform ${aberto ? "" : "-rotate-90"}`} />
                  </button>
                  {aberto && <p className="mt-2 text-xs leading-5 text-zinc-600 md:text-[13px]">{item.resposta}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
