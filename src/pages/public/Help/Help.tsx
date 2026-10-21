import { Link } from "react-router-dom";
import PublicFooter from "../../../components/layout/PublicFooter";
import {
  IconCheck,
  IconGift,
  IconHeart,
  IconHome,
  IconShare,
  IconTruck,
  IconUsers,
} from "../../../components/layout/Icons";

const LINK_INSTAGRAM = "https://www.instagram.com/";

const formas = [
  { titulo: "Adote um Focinho", texto: "Ofereça um lar de verdade e mude o destino de um peludinho.", botao: "Adotar Agora", to: "/adocao", Icone: IconHome },
  { titulo: "Seja Padrinho/Madrinha", texto: "Sustente despesas médicas e ração de um animal no abrigo.", botao: "Apadrinhar", to: "/apadrinhamento", Icone: IconHeart },
  { titulo: "Doe qualquer valor", texto: "Ajude financeiramente a cobrir tratamentos de emergência.", botao: "Fazer PIX", href: "#pix", Icone: IconGift, destaque: true },
  { titulo: "Seja Voluntário", texto: "Trabalhe diretamente na reabilitação e eventos do abrigo.", botao: "Quero Ajudar", to: "/voluntariado", Icone: IconUsers },
  { titulo: "Divulgue nossa Causa", texto: "Compartilhe nossos posts para alcançar mais adotantes.", botao: "Ir pro Instagram", externo: LINK_INSTAGRAM, Icone: IconShare },
  { titulo: "Doe Ração & Suprimentos", texto: "Entregue pacotes de ração ou cobertores diretamente ao abrigo.", botao: "Ver Endereço", to: "/contato", Icone: IconTruck },
];

const necessidades = [
  { titulo: "Alimentação", itens: ["Ração premium para filhotes", "Ração para cães adultos de porte grande", "Patês e sachês úmidos para gatos"] },
  { titulo: "Higiene & Limpeza", itens: ["Desinfetante herbal para canis", "Sacos de lixo reforçados (100L)", "Shampoos antipulgas para cães"] },
  { titulo: "Saúde & Conforto", itens: ["Vermífugos para filhotes", "Cobertores e caminhas laváveis", "Coleiras guia e caixas de transporte"] },
];

const botaoBase =
  "block rounded-lg px-4 py-2.5 text-center text-xs font-bold transition-colors";
const botaoAzul = `${botaoBase} bg-marca text-white hover:opacity-90`;
const botaoAmarelo = `${botaoBase} bg-destaque text-zinc-900 hover:bg-destaque-escura`;

function Acao({ forma }) {
  const classe = forma.destaque ? botaoAmarelo : botaoAzul;
  if (forma.to) return <Link to={forma.to} className={classe}>{forma.botao}</Link>;
  if (forma.externo)
    return (
      <a href={forma.externo} target="_blank" rel="noopener noreferrer" className={classe}>
        {forma.botao}
      </a>
    );
  return <a href={forma.href} className={classe}>{forma.botao}</a>;
}

export default function Help() {
  return (
    <>
      {/* =====================================================
          HERO
      ====================================================== */}
      <section
        className="relative flex min-h-[260px] items-center bg-cover bg-center md:min-h-[320px]"
        style={{ backgroundImage: "url('/images/como-ajudar/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 lg:px-14">
          <div className="max-w-xl text-white md:max-w-3xl">
            <h1 className="text-3xl font-extrabold md:text-4xl">
              Toda Ajuda Transforma Vidas
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/90 md:text-base">
              Seja doando mantimentos, apadrinhando uma patinha necessitada ou
              adotando de forma responsável. Encontre a alternativa que mais
              combina com você.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FORMAS DE CONTRIBUIR
      ====================================================== */}
      <section className="bg-white px-5 py-10 lg:px-14 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Formas de Contribuir
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Descubra os caminhos para ajudar nossos resgatados a terem uma vida
            mais confortável.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {formas.map((f) => (
              <article key={f.titulo} className="flex flex-col rounded-2xl bg-[#f1f1f1] p-5 md:p-6">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                    f.destaque ? "bg-destaque text-zinc-900" : "bg-marca text-white"
                  }`}
                >
                  <f.Icone />
                </div>
                <h3 className="mt-4 text-lg font-bold text-zinc-800">{f.titulo}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-5 text-zinc-500 md:text-xs">
                  {f.texto}
                </p>
                <div className="mt-4">
                  <Acao forma={f} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          DADOS BANCÁRIOS & PIX
      ====================================================== */}
      <section id="pix" className="scroll-mt-4 bg-[#f1f1f1] px-5 py-10 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-8 rounded-3xl bg-white p-6 md:flex-row md:justify-between md:p-10">
            <div className="w-full md:max-w-[640px]">
              <span className="rounded-full bg-sky-100 px-3 py-1 text-[10px] font-bold uppercase text-marca">
                Doações diretas
              </span>
              <h2 className="mt-4 text-2xl font-extrabold text-zinc-800 md:text-3xl">
                Dados Bancários &amp; PIX
              </h2>
              <p className="mt-4 text-sm leading-6 text-zinc-500">
                Como associação sem fins lucrativos, toda nossa contabilidade é
                auditada e publicada mensalmente.
                <span className="hidden md:inline">
                  {" "}Escolha seu método favorito para transferências.
                </span>
              </p>

              <p className="mt-5 text-[10px] font-bold uppercase text-marca">
                Chave PIX (CNPJ)
              </p>
              <p className="text-lg font-extrabold text-zinc-900">38.284.355/0001-22</p>

              <p className="mt-4 text-[10px] font-bold uppercase text-marca">
                Razão Social
              </p>
              <p className="text-sm font-bold text-zinc-900">
                Associação Protetora de Animais Focinho Amigo
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="rounded-2xl border-2 border-marca p-3">
                {/* TODO: trocar pelo QR Code oficial do PIX da ONG */}
                <img
                  src="/images/como-ajudar/qrcode-pix.png"
                  alt="QR Code para doação via PIX"
                  className="h-40 w-40 object-contain md:h-44 md:w-44"
                />
              </div>
              <p className="mt-3 max-w-[240px] text-xs font-semibold text-zinc-700">
                Abra o app do seu banco e aponte a câmera para doar via PIX
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          LISTA DE NECESSIDADES URGENTES
      ====================================================== */}
      <section className="bg-white px-5 py-10 lg:px-14 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-extrabold text-zinc-800 md:text-3xl">
            Lista de Necessidades Urgentes
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Temos demandas diárias de manutenção do abrigo. Você pode comprar e
            entregar diretamente para nós.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
            {necessidades.map((n) => (
              <article key={n.titulo} className="rounded-2xl bg-[#f8f9fb] p-6">
                <h3 className="text-lg font-bold text-marca">{n.titulo}</h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {n.itens.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-zinc-700">
                      <IconCheck className="h-3.5 w-3.5 shrink-0 text-destaque" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          EMPRESA PARCEIRA (ESG)
      ====================================================== */}
      <section className="bg-white px-5 pb-12 lg:px-14 lg:pb-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-3xl bg-marca p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
          <div className="md:max-w-3xl">
            <span className="rounded-full bg-sky-100 px-3 py-1 text-[10px] font-bold uppercase text-marca">
              ESG &amp; Impacto Social
            </span>
            <h2 className="mt-4 text-2xl font-extrabold md:text-3xl">
              Sua empresa apoia a causa animal?
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/90">
              Desenvolvemos parcerias corporativas personalizadas, ações de
              voluntariado empresarial e apoio com cotas mensais dedutíveis.
              Junte sua marca a um propósito transformador.
            </p>
          </div>
          {/* TODO: trocar por formulário/contato específico para empresas, se existir */}
          <Link
            to="/contato"
            className="block shrink-0 rounded-lg bg-destaque px-6 py-3 text-center text-sm font-bold text-zinc-900 transition-colors hover:bg-destaque-escura"
          >
            Seja uma Empresa Parceira
          </Link>
        </div>
      </section>
    </>
  );
}

