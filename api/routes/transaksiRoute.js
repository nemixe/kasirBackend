const express = require('express')
const transaksiController = require('../controllers/transaksiController')
const authRequired = require('../../helper/authHelper')
const router = express.Router()

router.get('/', transaksiController.ambilDataTransaksi)
router.post('/', transaksiController.tambahDataTransaksi)

module.exports = router