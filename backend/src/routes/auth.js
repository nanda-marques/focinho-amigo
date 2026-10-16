
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import { supabase } from '../lib/supabase.js'
import {
  autenticar,
  exigirPermissao,
} from '../middleware/authMiddleware.js'

const router = Router()

const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas tentativas. Tente novamente mais tarde.' },
})

function criarToken(admin) {
  return jwt.sign(
    { sub: admin.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  )
}

function dadosPublicos(admin, cargo) {
  return {
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
}

// POST /api/auth/login
router.post('/login', limiteLogin, async (req, res) => {
  try {
    const email = String(req.body?.email ?? '').trim().toLowerCase()
    const senha = req.body?.senha

    if (
      !email ||
      typeof senha !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({
        error: 'Informe um e-mail válido e uma senha.',
      })
    }

    const { data: admin, error } = await supabase
      .from('administradores')
      .select('id, nome, email, senha_hash, cargo, ativo')
      .eq('email', email)
      .maybeSingle()

    if (error) {
      console.error('Erro ao consultar administrador:', error.message)
      return res.status(500).json({ error: 'Erro interno ao entrar.' })
    }

    // Resposta genérica para não revelar se o e-mail existe.
    if (!admin || typeof admin.senha_hash !== 'string') {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' })
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha_hash)

    if (!senhaValida || !admin.ativo) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' })
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

    return res.json({
      token: criarToken(admin),
      usuario: dadosPublicos(admin, cargo),
    })
  } catch (error) {
    console.error('Erro no login:', error.message)
    return res.status(500).json({ error: 'Erro interno ao entrar.' })
  }
})

// GET /api/auth/me
router.get('/me', autenticar, (req, res) => {
  return res.json({ usuario: req.usuario })
})

// POST /api/auth/register
// Somente um administrador autorizado pode criar outra conta.
router.post(
  '/register',
  autenticar,
  exigirPermissao('pode_gerenciar_admins'),
  async (req, res) => {
    try {
      const nome = String(req.body?.nome ?? '').trim()
      const sobrenome = String(req.body?.sobrenome ?? '').trim()
      const email = String(req.body?.email ?? '').trim().toLowerCase()
      const senha = req.body?.senha
      const cargoInformado = req.body?.cargo

      if (!nome || !sobrenome || !email || !senha || !cargoInformado) {
        return res.status(400).json({
          error: 'Preencha todos os campos obrigatórios.',
        })
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'E-mail inválido.' })
      }

      if (
        typeof senha !== 'string' ||
        senha.length < 8 ||
        !/[A-Z]/.test(senha) ||
        !/\d/.test(senha) ||
        !/[^A-Za-z0-9]/.test(senha)
      ) {
        return res.status(400).json({
          error: 'Use ao menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.',
        })
      }

      const { data: existente, error: consultaError } = await supabase
        .from('administradores')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      if (consultaError) {
        console.error('Erro ao verificar e-mail:', consultaError.message)
        return res.status(500).json({ error: 'Erro ao verificar cadastro.' })
      }

      if (existente) {
        return res.status(409).json({ error: 'Este e-mail já está cadastrado.' })
      }

      // O frontend pode enviar o ID do cargo ou o nome exato cadastrado.
      let consultaCargo = supabase
        .from('cargos')
        .select('id, nome_cargo')
      
      if (
        typeof cargoInformado === 'number' ||
        /^\d+$/.test(String(cargoInformado))
      ) {
        consultaCargo = consultaCargo.eq('id', Number(cargoInformado))
      } else {
        consultaCargo = consultaCargo.eq('nome_cargo', String(cargoInformado).trim())
      }

      const { data: cargo, error: cargoError } = await consultaCargo.maybeSingle()

      if (cargoError) {
        console.error('Erro ao consultar cargo:', cargoError.message)
        return res.status(500).json({ error: 'Erro ao consultar cargo.' })
      }

      if (!cargo) {
        return res.status(400).json({
          error: 'O cargo selecionado não existe no banco de dados.',
        })
      }

      const senha_hash = await bcrypt.hash(senha, 12)

      const { data: novoAdmin, error: insertError } = await supabase
        .from('administradores')
        .insert({
          nome: `${nome} ${sobrenome}`,
          email,
          senha_hash,
          cargo: cargo.id,
          ativo: true,
        })
        .select('id, nome, email, cargo, ativo, criado_em')
        .single()

      if (insertError) {
        if (insertError.code === '23505') {
          return res.status(409).json({
            error: 'Este e-mail já está cadastrado.',
          })
        }

        console.error('Erro ao criar administrador:', insertError.message)
        return res.status(500).json({ error: 'Não foi possível criar a conta.' })
      }

      return res.status(201).json({
        mensagem: 'Conta criada com sucesso.',
        usuario: {
          id: novoAdmin.id,
          nome: novoAdmin.nome,
          email: novoAdmin.email,
          cargo: cargo.nome_cargo,
        },
      })
    } catch (error) {
      console.error('Erro no cadastro:', error.message)
      return res.status(500).json({ error: 'Erro interno ao criar conta.' })
    }
  }
)

export default router
