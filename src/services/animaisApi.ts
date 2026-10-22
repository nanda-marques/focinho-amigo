export interface Animal {
  id: string;                 
  nome: string;
  especie?: string;
  raca?: string;
  idade?: string;
  anos?: number;
  porte?: string;
  peso?: string;
  sexo?: string;
  castracao?: string;
  statusCastracao?: string;
  temperamento?: string;
  cor?: string;
  foto?: string;
  data?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export type NovoAnimal = Omit<Animal, "id" | "criadoEm" | "atualizadoEm">;

const BASE_URL = "http://localhost:3000/api/animais"; 

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Erro ${res.status} em ${url}`);
  }
  return (await res.json()) as T;
}

export const animaisApi = {
  listar: (): Promise<Animal[]> => request<Animal[]>(BASE_URL),

  criar: (dados: NovoAnimal): Promise<Animal> =>
    request<Animal>(BASE_URL, {
      method: "POST",
      body: JSON.stringify(dados),
    }),

  atualizar: (id: number | string, dados: NovoAnimal): Promise<Animal> =>
    request<Animal>(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    }),

  excluir: (id: number | string): Promise<void> =>
    request<void>(`${BASE_URL}/${id}`, { method: "DELETE" }),

  importarCSV: (file: File): Promise<{ importados: number }> => {
    const fd = new FormData();
    fd.append("file", file);
    return request<{ importados: number }>(`${BASE_URL}/importar-csv`, {
      method: "POST",
      body: fd
    });
  },
};