
import { Router } from 'express'
import { supabase } from '../lib/supabase.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('cargos')
      .select('id, nome_cargo')
      .order('nome_cargo')

    if (error) {
      console.error('Erro ao listar cargos:', error.message)
      return res.status(500).json({ error: 'Não foi possível listar os cargos.' })
    }

    return res.json({ cargos: data })
  } catch (error) {
    console.error('Erro ao listar cargos:', error.message)
    return res.status(500).json({ error: 'Erro interno ao listar cargos.' })
  }
})

export default router
