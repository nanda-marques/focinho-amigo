// Dados de teste (somente front-end). Quando houver back-end, esta lista
// passa a vir da API no mesmo formato.

import type { ItemHistorico, Pet } from "../types/pet";

export type { DetalhesPet, ItemHistorico, Pet, TipoHistorico } from "../types/pet";

const IMAGEM_TESTE = "/images/pets/amora.png";

const fotosTeste = (imagem: string): string[] => Array(4).fill(imagem);

const historico = ({
  vacina,
  vermifugo,
  castracao,
  microchip,
}: {
  vacina?: string;
  vermifugo?: string;
  castracao?: string;
  microchip?: string;
}): ItemHistorico[] => {
  const itens: ItemHistorico[] = [];
  if (vacina)
    itens.push({ tipo: "vacinacao", titulo: "Vacinação", texto: vacina });
  if (vermifugo)
    itens.push({
      tipo: "vermifugacao",
      titulo: "Vermifugação/Ectoparasitas",
      texto: vermifugo,
    });
  if (castracao)
    itens.push({ tipo: "castracao", titulo: "Castração", texto: castracao });
  if (microchip)
    itens.push({ tipo: "microchip", titulo: "Microchip", texto: microchip });
  return itens;
};


export const pets: Pet[] = [
  {
    id: 1,
    nome: "Simba",
    tipo: "Cão",
    raca: "Golden Retriever",
    idade: "2 anos",
    anos: 2,
    porte: "Médio",
    sexo: "M",
    tags: ["Brincalhão", "Dócil"],
    descricao: "Um golden sociável que adora brincar com bolinhas e crianças.",
    imagem:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600",
    disponivelAdocao: true,
    detalhes: {
      fotos: fotosTeste(
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600"
      ),
      idadeEstimada: "2 anos",
      peso: "28 kg",
      castrado: "Sim",
      cor: "Dourado",
      temperamento: "Brincalhão ▪ Dócil",
      sobre:
        "Simba é um golden retriever muito sociável, que adora brincar com bolinhas e receber carinho. Foi entregue ao abrigo após a mudança da antiga família e se adaptou rápido à rotina. Convive bem com crianças e com outros cães.",
      historico: historico({
        vacina: "Atualizada (V10 e Raiva aplicadas em 10/02/2026).",
        vermifugo: "Em dia (última dose em 05/09/2026).",
        castracao: "Realizada em 12/04/2025",
        microchip: "Implantado",
      }),
    },
  },
  {
    id: 2,
    nome: "Amora",
    tipo: "Gato",
    raca: "Sem raça definida",
    idade: "1 ano",
    anos: 1,
    porte: "Pequeno",
    sexo: "F",
    tags: ["Carinhosa", "Curiosa"],
    descricao: "Uma gatinha carinhosa que adora um colo e uma janela ensolarada.",
    imagem:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600",
    disponivelAdocao: true,
    detalhes: {
      fotos: fotosTeste(
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600"
      ),
      idadeEstimada: "1 ano",
      peso: "3,5 kg",
      castrado: "Sim",
      cor: "Rajado",
      sobre:
        "Amora é uma gatinha carinhosa e curiosa, que ronrona alto e adora observar a rua pela janela. Foi resgatada ainda filhote e cresceu em lar temporário, acostumada com crianças e outros gatos.",
      historico: historico({
        vacina: "Atualizada (V4 e Raiva aplicadas em 20/01/2026).",
        vermifugo: "Em dia (última dose em 01/09/2026).",
        castracao: "Realizada em 18/05/2026",
        microchip: "Não implantado",
      }),
    },
  },
  {
    id: 7,
    nome: "Thor",
    tipo: "Cão",
    raca: "Labrador",
    sexo: "M",
    idade: "8 meses",
    anos: 0.7,
    porte: "Grande",
    tags: ["Brincalhão", "Carinhoso"],
    descricao: "Um filhote cheio de energia que adora brincar e passear.",
    imagem: IMAGEM_TESTE,
    detalhes: {
      fotos: fotosTeste(IMAGEM_TESTE),
      idadeEstimada: "8 meses",
      peso: "18 kg",
      castrado: "Não (agendada)",
      cor: "Chocolate",
      sobre:
        "Thor é um filhote de labrador cheio de energia, que adora brincar, correr e mastigar brinquedos. Precisa de passeios diários e de uma família disposta a ajudar no adestramento básico.",
      historico: historico({
        vacina: "Em andamento (2ª dose de V10 aplicada em 02/10/2026).",
        vermifugo: "Em dia (última dose em 25/09/2026).",
        castracao: "Agendada para o início de 2027",
        microchip: "Não implantado",
      }),
    },
  },
  {
    id: 8,
    nome: "Luna",
    tipo: "Gato",
    raca: "SRD",
    sexo: "F",
    idade: "6 meses",
    anos: 0.5,
    porte: "Pequeno",
    tags: ["Dócil", "Curiosa"],
    descricao: "Uma gatinha curiosa que gosta de explorar novos ambientes.",
    imagem: IMAGEM_TESTE,
    detalhes: {
      fotos: fotosTeste(IMAGEM_TESTE),
      idadeEstimada: "6 meses",
      peso: "2,8 kg",
      castrado: "Não (agendada)",
      cor: "Preta com patinhas brancas",
      sobre:
        "Luna é uma gatinha dócil e muito curiosa, que adora explorar cada cantinho da casa e brincar com bolinhas e varinhas. Está acostumada ao convívio com pessoas e com outros gatos.",
      historico: historico({
        vacina: "Em andamento (1ª dose de V4 aplicada em 28/09/2026).",
        vermifugo: "Em dia (última dose em 28/09/2026).",
        castracao: "Agendada para dezembro de 2026",
        microchip: "Não implantado",
      }),
    },
  },
  {
    id: 9,
    nome: "Bob",
    tipo: "Cão",
    raca: "Beagle",
    sexo: "M",
    idade: "3 anos",
    anos: 3,
    porte: "Médio",
    tags: ["Amigável", "Ativo"],
    descricao: "Um cão sociável que gosta de companhia e caminhadas.",
    imagem: IMAGEM_TESTE,
    detalhes: {
      fotos: fotosTeste(IMAGEM_TESTE),
      idadeEstimada: "3 anos",
      peso: "14 kg",
      castrado: "Sim",
      cor: "Tricolor",
      sobre:
        "Bob é um beagle muito amigável, farejador nato e apaixonado por caminhadas. Se dá bem com crianças e outros cães, mas precisa de um quintal cercado ou de passeios longos todos os dias.",
      historico: historico({
        vacina: "Atualizada (V10 e Raiva aplicadas em 08/03/2026).",
        vermifugo: "Em dia (última dose em 02/09/2026).",
        castracao: "Realizada em 14/08/2025",
        microchip: "Implantado",
      }),
    },
  },
  {
    id: 10,
    nome: "Mia",
    tipo: "Gato",
    raca: "SRD",
    sexo: "F",
    idade: "2 anos",
    anos: 2,
    porte: "Pequeno",
    tags: ["Tranquila", "Independente"],
    descricao: "Uma gatinha tranquila que aprecia ambientes confortáveis.",
    imagem: IMAGEM_TESTE,
    detalhes: {
      fotos: fotosTeste(IMAGEM_TESTE),
      idadeEstimada: "2 anos",
      peso: "4 kg",
      castrado: "Sim",
      cor: "Cinza",
      sobre:
        "Mia é uma gatinha tranquila e independente, que aprecia ambientes silenciosos e uma boa caminha ao sol. Gosta de carinho, mas no tempo dela. Ideal para quem procura uma companhia calma.",
      historico: historico({
        vacina: "Atualizada (V4 e Raiva aplicadas em 15/02/2026).",
        vermifugo: "Em dia (última dose em 10/09/2026).",
        castracao: "Realizada em 03/11/2025",
        microchip: "Não implantado",
      }),
    },
  },
  {
    id: 11,
    nome: "Max",
    tipo: "Cão",
    raca: "Pastor Alemão",
    sexo: "M",
    idade: "7 anos",
    anos: 7,
    porte: "Grande",
    tags: ["Leal", "Calmo"],
    descricao: "Um companheiro leal que merece uma família amorosa.",
    imagem: IMAGEM_TESTE,
    detalhes: {
      fotos: fotosTeste(IMAGEM_TESTE),
      idadeEstimada: "7 anos",
      peso: "34 kg",
      castrado: "Sim",
      cor: "Preto e fogo",
      sobre:
        "Max é um pastor alemão idoso, calmo e extremamente leal. Já passou da fase de muita agitação e agora só quer um lar tranquilo, com carinho e passeios leves. Faz acompanhamento veterinário de rotina para as articulações.",
      historico: historico({
        vacina: "Atualizada (V10 e Raiva aplicadas em 22/01/2026).",
        vermifugo: "Em dia (última dose em 30/08/2026).",
        castracao: "Realizada em 2022",
        microchip: "Implantado",
      }),
    },
  },
  {
    id: 12,
    nome: "Nina",
    tipo: "Gato",
    raca: "SRD",
    sexo: "F",
    idade: "9 anos",
    anos: 9,
    porte: "Pequeno",
    tags: ["Carinhosa", "Calma"],
    descricao: "Uma gata adulta que adora descansar perto de pessoas.",
    imagem: IMAGEM_TESTE,
    detalhes: {
      fotos: fotosTeste(IMAGEM_TESTE),
      idadeEstimada: "9 anos",
      peso: "4,2 kg",
      castrado: "Sim",
      cor: "Branca e caramelo",
      sobre:
        "Nina é uma gata sênior, muito calma e carinhosa, que adora ficar perto das pessoas e dormir no sofá. Faz exames de rotina duas vezes por ano e come ração própria para a idade.",
      historico: historico({
        vacina: "Atualizada (V4 e Raiva aplicadas em 05/02/2026).",
        vermifugo: "Em dia (última dose em 12/09/2026).",
        castracao: "Realizada em 2019",
        microchip: "Não implantado",
      }),
    },
  },
  {
    id: 13,
    nome: "Mel",
    tipo: "Cão",
    raca: "SRD",
    sexo: "F",
    idade: "1 ano",
    anos: 1,
    porte: "Pequeno",
    tags: ["Alegre", "Companheira"],
    descricao: "Uma cadelinha alegre que gosta de receber carinho.",
    imagem: IMAGEM_TESTE,
    detalhes: {
      fotos: fotosTeste(IMAGEM_TESTE),
      idadeEstimada: "1 ano",
      peso: "7 kg",
      castrado: "Sim",
      cor: "Caramelo",
      sobre:
        "Mel é uma cadelinha alegre e companheira, que balança o rabo para todo mundo. Adora brincar de buscar a bolinha e dorme sempre pertinho de quem cuida dela. Se adapta bem a apartamentos.",
      historico: historico({
        vacina: "Atualizada (V10 e Raiva aplicadas em 17/03/2026).",
        vermifugo: "Em dia (última dose em 04/09/2026).",
        castracao: "Realizada em 29/06/2026",
        microchip: "Não implantado",
      }),
    },
  },
  {
    id: 14,
    nome: "Simba",
    tipo: "Gato",
    raca: "SRD",
    sexo: "M",
    idade: "4 anos",
    anos: 4,
    porte: "Médio",
    tags: ["Brincalhão", "Sociável"],
    descricao: "Um gato brincalhão que gosta de interagir com a família.",
    imagem: IMAGEM_TESTE,
    detalhes: {
      fotos: fotosTeste(IMAGEM_TESTE),
      idadeEstimada: "4 anos",
      peso: "5,5 kg",
      castrado: "Sim",
      cor: "Laranja",
      sobre:
        "Simba é um gato laranja sociável e brincalhão, que adora interagir com a família e correr atrás de brinquedos. Se dá bem com crianças e já viveu com cães em lar temporário.",
      historico: historico({
        vacina: "Atualizada (V4 e Raiva aplicadas em 11/02/2026).",
        vermifugo: "Em dia (última dose em 08/09/2026).",
        castracao: "Realizada em 20/09/2023",
        microchip: "Implantado",
      }),
    },
  },
  {
    id: 15,
    nome: "Bela",
    tipo: "Cão",
    raca: "Golden Retriever",
    sexo: "F",
    idade: "5 anos",
    anos: 5,
    porte: "Grande",
    tags: ["Dócil", "Sociável"],
    descricao: "Uma companheira dócil que adora estar perto das pessoas.",
    imagem: IMAGEM_TESTE,
    detalhes: {
      fotos: fotosTeste(IMAGEM_TESTE),
      idadeEstimada: "5 anos",
      peso: "27 kg",
      castrado: "Sim",
      cor: "Dourado claro",
      sobre:
        "Bela é uma golden madura, dócil e muito sociável, que adora estar perto das pessoas. Anda bem na guia, não costuma latir e se dá bem com crianças e outros animais.",
      historico: historico({
        vacina: "Atualizada (V10 e Raiva aplicadas em 25/01/2026).",
        vermifugo: "Em dia (última dose em 03/09/2026).",
        castracao: "Realizada em 2023",
        microchip: "Implantado",
      }),
    },
  },
  {
    id: 16,
    nome: "Fred",
    tipo: "Gato",
    raca: "SRD",
    sexo: "M",
    idade: "1 ano",
    anos: 1,
    porte: "Pequeno",
    tags: ["Curioso", "Ativo"],
    descricao: "Um gatinho curioso que gosta de brincar e explorar.",
    imagem: IMAGEM_TESTE,
    detalhes: {
      fotos: fotosTeste(IMAGEM_TESTE),
      idadeEstimada: "1 ano",
      peso: "3,8 kg",
      castrado: "Sim",
      cor: "Preto e branco",
      sobre:
        "Fred é um gatinho curioso e ativo, que adora escalar, explorar cada canto e brincar com varinhas. Precisa de brinquedos e de um ambiente com bastante estímulo para gastar energia.",
      historico: historico({
        vacina: "Atualizada (V4 e Raiva aplicadas em 09/03/2026).",
        vermifugo: "Em dia (última dose em 06/09/2026).",
        castracao: "Realizada em 15/07/2026",
        microchip: "Não implantado",
      }),
    },
  },
  {
    id: 17,
    nome: "Duke",
    tipo: "Cão",
    raca: "SRD",
    sexo: "M",
    idade: "6 anos",
    anos: 6,
    porte: "Médio",
    tags: ["Tranquilo", "Leal"],
    descricao: "Um cão tranquilo que procura um lar cheio de carinho.",
    imagem: IMAGEM_TESTE,
    detalhes: {
      fotos: fotosTeste(IMAGEM_TESTE),
      idadeEstimada: "6 anos",
      peso: "19 kg",
      castrado: "Sim",
      cor: "Preto",
      sobre:
        "Duke é um cão tranquilo e muito leal, que procura um lar cheio de carinho depois de anos nas ruas. É calmo em casa, gosta de passeios curtos e de ficar deitado perto de quem ama.",
      historico: historico({
        vacina: "Atualizada (V10 e Raiva aplicadas em 30/01/2026).",
        vermifugo: "Em dia (última dose em 14/09/2026).",
        castracao: "Realizada em 2024",
        microchip: "Não implantado",
      }),
    },
  },
  {
    id: 18,
    nome: "Melancia",
    tipo: "Gato",
    raca: "SRD",
    sexo: "F",
    idade: "3 anos",
    anos: 3,
    porte: "Pequeno",
    tags: ["Carinhosa", "Brincalhona"],
    descricao: "Uma gata carinhosa que gosta de brincar e descansar.",
    imagem: IMAGEM_TESTE,
    detalhes: {
      fotos: fotosTeste(IMAGEM_TESTE),
      idadeEstimada: "3 anos",
      peso: "4,1 kg",
      castrado: "Sim",
      cor: "Tricolor",
      sobre:
        "Melancia é uma gata tricolor carinhosa e brincalhona, que alterna entre corridas pela casa e longas sonecas no colo. Convive bem com crianças e com outros gatos.",
      historico: historico({
        vacina: "Atualizada (V4 e Raiva aplicadas em 12/02/2026).",
        vermifugo: "Em dia (última dose em 09/09/2026).",
        castracao: "Realizada em 05/10/2024",
        microchip: "Não implantado",
      }),
    },
  },
];