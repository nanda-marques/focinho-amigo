const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      ...(opcoes.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}),
      ...opcoes.headers,
    },
  });
  const dados = resposta.status === 204 ? null : await resposta.json().catch(() => null);
  if (!resposta.ok) throw new Error(dados?.erro || dados?.message || "Erro ao comunicar com o servidor.");
  return dados;
}

export const publicacoesApi = {
  listarAdmin: () => requisicao("/api/publicacoes/admin"),
  listarPublicadas: () => requisicao("/api/publicacoes"),
  buscar: (id) => requisicao(`/api/publicacoes/${id}`),
  salvar: (dados) => requisicao(dados.id ? `/api/publicacoes/${dados.id}` : "/api/publicacoes", {
    method: dados.id ? "PUT" : "POST",
    body: JSON.stringify(dados),
  }),
  excluir: (id) => requisicao(`/api/publicacoes/${id}`, { method: "DELETE" }),
};
