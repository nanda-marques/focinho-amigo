// Dados de teste (somente front-end). Quando houver back-end, esta lista
// passa a vir da API no mesmo formato.
// Para testar a tela vazia, deixe `publicacoes` como [].

export type Categoria = "Campanha" | "Eventos" | "Adoções" | "Notícias";

export type BlocoConteudo =
  | { tipo: "paragrafo"; texto: string }
  | { tipo: "titulo"; texto: string }
  | { tipo: "lista"; itens: { destaque?: string; texto: string }[] };

export interface Publicacao {
  id: number;
  categoria: Categoria;
  titulo: string;
  /** Data no formato AAAA-MM-DD */
  data: string;
  autor?: string;
  resumo: string;
  imagem: string;
  /** Campanha urgente: aparece primeiro no carrossel */
  urgente?: boolean;
  /** Em destaque: aparece no carrossel depois das urgentes */
  destaque?: boolean;
  /** Conteúdo completo da página de detalhe. Sem isso, usa o resumo. */
  conteudo?: BlocoConteudo[];
}

export const publicacoes: Publicacao[] = [
  {
    id: 1,
    categoria: "Campanha",
    urgente: true,
    titulo: "Ajude o Rex! Ele precisa de uma cirurgia.",
    data: "2026-10-05",
    resumo:
      "O Rex foi resgatado com uma fratura complexa no quadril após sofrer um atropelamento. Precisamos arrecadar o valor do procedimento cirúrgico ortopédico e os custos pós-operatórios para que ele volte a correr alegremente. Meta: R$ 4500",
    imagem: "/src/assets/images/pets/rex.png",
  },
  {
    id: 2,
    categoria: "Campanha",
    urgente: true,
    titulo: "Campanha de arrecadação para o abrigo de inverno",
    data: "2026-08-26",
    autor: "Mariana Silva",
    resumo:
      "Estamos iniciando a nossa campanha de arrecadação de emergência. Atualmente, a Focinho Amigo abriga mais de 120 animais resgatados de situações críticas de maus-tratos ou abandono.",
    imagem: "/src/assets/images/pets/rex.png",
    conteudo: [
      {
        tipo: "paragrafo",
        texto:
          "Estamos iniciando a nossa campanha de arrecadação de emergência para o Rex. Atualmente, a Focinho Amigo abriga mais de 120 animais entre cães e gatos que foram resgatados de situações críticas de maus-tratos ou abandono.",
      },
      {
        tipo: "paragrafo",
        texto:
          "Nosso maior desafio atualmente é manter a saúde desse amiguinho. Contamos com sua colaboração para darmos dignidade a essa vida.",
      },
      { tipo: "titulo", texto: "Como você pode ajudar?" },
      {
        tipo: "lista",
        itens: [
          {
            destaque: "Doações materiais",
            texto:
              "Entregue cobertores, caminhas, ração para filhotes e adultos ou roupinhas pet diretamente em nossa sede.",
          },
          {
            destaque: "Voluntariado",
            texto:
              "Ajude a organizar o abrigo de inverno, alimentar os animais ou auxiliar nos mutirões de banho e tosa.",
          },
          {
            destaque: "Divulgação e Adoção",
            texto:
              "Compartilhe nossa campanha nas redes sociais ou dê um lar temporário (ou definitivo!) para um de nossos focinhos.",
          },
        ],
      },
      {
        tipo: "paragrafo",
        texto:
          "Nenhum gesto de carinho é pequeno demais. Juntos, conseguimos transformar o inverno desses animais em uma estação cheia de calor humano, dignidade e esperança de um recomeço feliz. Contamos com a sua solidariedade!",
      },
    ],
  },
  {
    id: 3,
    categoria: "Campanha",
    destaque: true,
    titulo: "Mutirão de Cirurgia para o Bento",
    data: "2026-03-12",
    resumo:
      "Ajude-nos a arrecadar fundos para a cirurgia ortopédica urgente do Bento, resgatado após atropelamento grave.",
    imagem: "/images/eventos/bento.jpg",
  },
  {
    id: 4,
    categoria: "Eventos",
    titulo: "Feira de Adoção e Bazar Beneficente",
    data: "2026-03-20",
    resumo:
      "Venha conhecer nossos cães e gatos em busca de um lar e aproveite nosso bazar exclusivo.",
    imagem: "/images/eventos/feira.jpg",
  },
  {
    id: 5,
    categoria: "Adoções",
    titulo: "Mia: De Abandonada a Rainha do Lar",
    data: "2026-03-08",
    resumo:
      "Uma emocionante história de resgate e superação de uma gatinha que encontrou sua família perfeita.",
    imagem: "/images/eventos/mia.jpg",
  },
  {
    id: 6,
    categoria: "Notícias",
    titulo: "Nova Parceria com Clínica Veterinária",
    data: "2026-03-01",
    resumo:
      "Garantimos atendimento gratuito e de qualidade para todos os nossos resgatados com a nova clínica.",
    imagem: "/images/eventos/clinica.jpg",
  },
  {
    id: 7,
    categoria: "Campanha",
    titulo: "Ajude na Castração Solidária de Rua",
    data: "2026-02-18",
    resumo:
      "Nosso objetivo é castrar mais de 50 animais de rua neste mês. Junte-se a nós nesta causa importante.",
    imagem: "/images/eventos/castracao.jpg",
  },
];

const maisRecentePrimeiro = (a: Publicacao, b: Publicacao) =>
  b.data.localeCompare(a.data);

/** Carrossel: primeiro as campanhas urgentes, depois as em destaque. */
export const campanhasEmDestaque: Publicacao[] = [
  ...publicacoes.filter((p) => p.urgente).sort(maisRecentePrimeiro),
  ...publicacoes.filter((p) => !p.urgente && p.destaque).sort(maisRecentePrimeiro),
];

export function buscarPublicacao(id: string | undefined): Publicacao | undefined {
  return publicacoes.find((p) => String(p.id) === id);
}

const MESES_CURTOS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

function partes(iso: string) {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return { ano, mes, dia };
}

/** "12 Mar 2026" */
export function formatarDataCurta(iso: string): string {
  const { ano, mes, dia } = partes(iso);
  return `${String(dia).padStart(2, "0")} ${MESES_CURTOS[mes - 1]} ${ano}`;
}

/** "26 de agosto de 2026" */
export function formatarDataExtenso(iso: string): string {
  const { ano, mes, dia } = partes(iso);
  return `${dia} de ${MESES[mes - 1]} de ${ano}`;
}