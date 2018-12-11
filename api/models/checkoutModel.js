const mongoose = require('mongoose')

const checkoutSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  jumlahTransaksi: Number
})

module.exports = mongoose.model('checkout', checkoutSchema)