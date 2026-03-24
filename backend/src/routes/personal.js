const express = require('express')
const router = express.Router()
const {
  getPersonal,
  getPersonalById,
  createPersonal,
  getPersonalCompleto,
  updatePersonal
} = require('../controllers/personalController')

router.get('/', getPersonal)
router.get('/:id', getPersonalById)
router.get('/:id/completo', getPersonalCompleto)
router.post('/', createPersonal)
router.put('/:id', updatePersonal)

module.exports = router