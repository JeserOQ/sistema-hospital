const express = require('express')
const router = express.Router()
const {
  getPersonal,
  getPersonalById,
  createPersonal,
  getPersonalCompleto
} = require('../controllers/personalController')

router.get('/', getPersonal)
router.get('/:id', getPersonalById)
router.get('/:id/completo', getPersonalCompleto)
router.post('/', createPersonal)

module.exports = router