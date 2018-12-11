const mongoose = require('mongoose')

const bukuSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  kode: {
    type: Number,
    unique: true,
    required: true
  },
  namaBuku: {
    type: String,
    required: true
  },
  harga: {
    type: Number,
    required: true
  },
  jumlahBuku: { type: Number, default: 1 }
})

module.exports = mongoose.model('buku', bukuSchema)