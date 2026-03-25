const express = require('express')
const router = express.Router()
const { getCitasByEstudiante, createCita } = require('../controllers/citasController')

router.get('/estudiante/:id', getCitasByEstudiante)
router.post('/', createCita)

module.exports = router