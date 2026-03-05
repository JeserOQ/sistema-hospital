const express = require('express')
const router = express.Router()
const {
  getPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente
} = require('../controllers/pacientesController')

router.get('/', getPacientes)
router.get('/:id', getPacienteById)
router.post('/', createPaciente)
router.put('/:id', updatePaciente)

module.exports = router