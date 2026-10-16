
import jwt from 'jsonwebtoken'
import { supabase } from '../lib/supabase.js'

export async function autenticar(req, res, next) {
  const authorization = req.headers.authorization

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Autenticação necessária.' })
  }

  const token = authorization.slice(7)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    if (
      typeof payload !== 'object' ||
      !Number.isInteger(payload.sub)
    ) {
      return res.status(401).json({ error: 'Token inválido.' })
    }

    const { data: admin, error } = await supabase
      .from('administradores')
      .select('id, nome, email, cargo, ativo')
      .eq('id', payload.sub)
      .maybeSingle()

    if (error) {
      console.error('Erro ao verificar administrador:', error.message)
      return res.status(500).json({ error: 'Erro interno de autenticação.' })
    }

    if (!admin || !admin.ativo) {
      return res.status(401).json({
        error: 'Conta inexistente ou desativada.',
      })
    }

    const { data: cargo, error: cargoError } = await supabase
      .from('cargos')
      .select(
        'id, nome_cargo, pode_gerenciar_animais, pode_gerenciar_conteudo, pode_gerenciar_newsletter, pode_gerenciar_admins'
      )
      .eq('id', admin.cargo)
      .maybeSingle()

    if (cargoError) {
      console.error('Erro ao consultar cargo:', cargoError.message)
      return res.status(500).json({ error: 'Erro ao consultar permissões.' })
    }

    if (!cargo) {
      return res.status(403).json({ error: 'Cargo não configurado.' })
    }

    req.usuario = {
      id: admin.id,
      nome: admin.nome,
      email: admin.email,
      cargo: {
        id: cargo.id,
        nome: cargo.nome_cargo,
        pode_gerenciar_animais: cargo.pode_gerenciar_animais,
        pode_gerenciar_conteudo: cargo.pode_gerenciar_conteudo,
        pode_gerenciar_newsletter: cargo.pode_gerenciar_newsletter,
        pode_gerenciar_admins: cargo.pode_gerenciar_admins,
      },
    }

    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
}

export function exigirPermissao(permissao) {
  return (req, res, next) => {
    if (!req.usuario?.cargo?.[permissao]) {
      return res.status(403).json({
        error: 'Você não tem permissão para executar esta ação.',
      })
    }

    next()
  }
}
