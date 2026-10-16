
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cargosRouter from './routes/cargos.js'
import authRouter from './routes/auth.js'

if (!process.env.JWT_SECRET) {
  throw new Error('Configure JWT_SECRET no backend/.env')
}

const app = express()
const port = process.env.PORT || 3000

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}))

app.use(express.json({ limit: '20kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API Focinho Amigo funcionando' })
})

app.use('/api/cargos', cargosRouter)
app.use('/api/auth', authRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' })
})

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`)
})
