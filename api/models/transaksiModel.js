const mongoose = require('mongoose')

const transaksiSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idCheckout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'checkout',
    required: true
  },
  idBuku: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'buku',
    required: true
  },
  jumlah: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('transaksi', transaksiSchema)