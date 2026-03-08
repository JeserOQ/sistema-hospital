const express = require('express')
const router = express.Router()
const resetController = require('../controllers/resetController')

router.post('/solicitar', resetController.solicitarReset)
router.post('/confirmar', resetController.confirmarReset)

module.exports = router