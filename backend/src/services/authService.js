
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function fazerLogin(email, senha) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Não foi possível entrar.')
  }

  return data
}

export async function buscarSessao(token) {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Sessão inválida.')
  }

  return data.usuario
}

export async function cadastrarAdministrador(token, dados) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  })

  const data = await response.json()

  if (!response.ok) {
    const erro = new Error(data.error || 'Não foi possível criar a conta.')
    erro.status = response.status
    throw erro
  }

  return data
}
