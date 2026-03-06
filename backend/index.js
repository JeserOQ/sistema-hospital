const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://sistema-hospital-flame.vercel.app'
  ],
  credentials: true
}))

// Rutas
const pacientesRoutes = require('./src/routes/pacientes')
const personalRoutes = require('./src/routes/personal')
const registrosRoutes = require('./src/routes/registros')
const authRoutes = require('./src/routes/auth')

app.use('/api/pacientes', pacientesRoutes)
app.use('/api/personal', personalRoutes)
app.use('/api/registros', registrosRoutes)
app.use('/api/auth', authRoutes)

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor funcionando correctamente' })
})

// Puerto
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})