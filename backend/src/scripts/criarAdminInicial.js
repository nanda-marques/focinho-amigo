import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { supabase } from '../lib/supabase.js'

async function criarAdminInicial() {
  const nome = process.env.ADMIN_INICIAL_NOME?.trim()
  const email = process.env.ADMIN_INICIAL_EMAIL?.trim().toLowerCase()
  const senha = process.env.ADMIN_INICIAL_SENHA

  if (!nome || !email || !senha) {
    throw new Error(
      'Configure ADMIN_INICIAL_NOME, ADMIN_INICIAL_EMAIL e ADMIN_INICIAL_SENHA no backend/.env'
    )
  }

  if (
    senha.length < 8 ||
    !/[A-Z]/.test(senha) ||
    !/\d/.test(senha) ||
    !/[^A-Za-z0-9]/.test(senha)
  ) {
    throw new Error(
      'A senha precisa ter 8 caracteres, letra maiúscula, número e caractere especial.'
    )
  }

  const { data: admins, error: consultaAdminsError } = await supabase
    .from('administradores')
    .select('id')
    .limit(1)

  if (consultaAdminsError) throw consultaAdminsError

  if (admins.length > 0) {
    throw new Error(
      'Já existe um administrador. O script inicial não pode ser executado novamente.'
    )
  }

  const { data: cargo, error: cargoError } = await supabase
    .from('cargos')
    .select('id, nome_cargo, pode_gerenciar_admins')
    .eq('nome_cargo', 'Administrador')
    .single()

  if (cargoError) throw cargoError

  if (!cargo.pode_gerenciar_admins) {
    throw new Error('O cargo Administrador não tem permissão para gerenciar contas.')
  }

  const senha_hash = await bcrypt.hash(senha, 12)

  const { data: admin, error: insertError } = await supabase
    .from('administradores')
    .insert({
      nome,
      email,
      senha_hash,
      cargo: cargo.id,
      ativo: true,
    })
    .select('id, nome, email, cargo, ativo')
    .single()

  if (insertError) throw insertError

  console.log('Administrador inicial criado com sucesso.')
  console.log(`ID: ${admin.id}`)
  console.log(`Nome: ${admin.nome}`)
  console.log(`E-mail: ${admin.email}`)
}

criarAdminInicial().catch((error) => {
  console.error('Não foi possível criar o administrador:', error.message)
  process.exitCode = 1
})