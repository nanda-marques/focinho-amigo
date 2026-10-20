const API_URL = "http://localhost:3000/api/animais";

export const animaisApi = {
  // Listar todos os animais cadastrados
  async listar() {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error("Erro ao carregar a lista de animais.");
    }
    return res.json();
  },

  // Buscar um animal específico por ID
  async buscar(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) {
      throw new Error("Animal não encontrado.");
    }
    return res.json();
  },

  // Cadastrar um novo animal
  async criar(dados) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      throw new Error(erro.mensagem || "Não foi possível cadastrar o animal.");
    }
    return res.json();
  },

  // Atualizar dados de um animal existente
  async atualizar(id, dados) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      throw new Error(erro.mensagem || "Não foi possível atualizar o animal.");
    }
    return res.json();
  },

  // Excluir um animal
  async excluir(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Não foi possível excluir o animal.");
    }
    return true;
  },

  // Importar lote via arquivo CSV
  async importarCSV(file) {
    const formData = new FormData();
    formData.append("arquivo", file);

    const res = await fetch(`${API_URL}/importar-csv`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Falha ao importar arquivo CSV.");
    }
    return res.json();
  },
};