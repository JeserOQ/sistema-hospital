const express = require('express')
const router = express.Router()
const { getEstudiantes, getEstudianteById, createEstudiante } = require('../controllers/estudiantesController')

router.get('/', getEstudiantes)
router.get('/:id', getEstudianteById)
router.post('/', createEstudiante)

module.exports = router