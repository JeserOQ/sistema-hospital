const express = require('express')
const router = express.Router()
const {
  getRegistrosByPaciente,
  createRegistro,
  getRegistrosByTipo
} = require('../controllers/registrosController')

router.get('/paciente/:pacienteId', getRegistrosByPaciente)
router.get('/paciente/:pacienteId/tipo/:tipo', getRegistrosByTipo)
router.post('/', createRegistro)

module.exports = router