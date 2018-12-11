const express = require('express')
const router = express.Router()
const bukuController = require('../controllers/bukuController')

router.get('/', bukuController.ambilDataBuku)
router.get('/:kode', bukuController.ambilDataKode)
router.post('/', bukuController.tambahBuku)
router.patch('/', bukuController.updateBuku)
router.delete('/', bukuController.deleteBuku)

module.exports = router