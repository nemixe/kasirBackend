const mongoose = require('mongoose')
const bukuModel = require('../models/bukuModel')

module.exports = {
  ambilDataBuku: (req, res, next) => {
    bukuModel.find()
      .exec()
      .then(buku => {
        if (!buku.length) {
          return res.status(204).json()
        }
        res.status(200).json({
          message: "Semua data buku",
          length: buku.length,
          payload: buku
        })
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      })
  },
  ambilDataKode: (req, res, next) => {
    const { kode } = req.params
    bukuModel.find({ kode: { $regex: '.*' + kode + '.*' } })
      .exec()
      .then(buku => {
        if (!buku) {
          return res.status(404).json({
            message: "Data dengan id " + kode + " tidak dapat ditemukan"
          })
        }
        console.log(buku)
        res.status(200).json({
          payload: buku
        })
      }).catch(err => {
        res.status(500).json({
          message: "Gagal mencari data",
          error: err
        })
      })
  },
  tambahBuku: (req, res, next) => {

    const { kode, nama_buku, harga, jumlah_buku } = req.body

    const buku = new bukuModel({
      _id: new mongoose.Types.ObjectId(),
      kode: kode,
      namaBuku: nama_buku,
      harga: harga,
      jumlahBuku: jumlah_buku
    })

    buku.save()
      .then(buku => {
        res.status(200).json({
          Message: "Sukses menambah data buku",
          payload: buku
        })
      }).catch(err => {
        res.status(500).json({
          Message: "Gagal menambah data buku",
          error: err
        })
      })
  },

  updateBuku: (req, res, next) => {

    const { kode, jumlah_buku } = req.body

    if (!kode || !jumlah_buku) {
      return res.status(500).json({
        message: "Parameter tidak valid"
      })
    }

    bukuModel.findOne({ kode })
      .exec()
      .then(({ jumlahBuku }) => {
        const total = jumlahBuku + jumlah_buku
        bukuModel.updateOne({ kode }, { $set: { jumlahBuku: total } }, (err, buku) => {
          if (err) {
            return res.status(500).json({
              message: "Gagal mengupdate data buku",
              error: err
            })
          }

          if (buku.n == 0) {
            return res.status(404).json({
              message: "Buku dengan id tersebut tidak tersedia"
            })
          }

          res.status(200).json({
            message: "Sukses mengupdate data buku",
            payload: buku
          })
        })
      })
      .catch(err => {
        res.status(500).json({
          message: "Gagal mencari data spesifik",
          error: err
        })
      })
  },

  deleteBuku: (req, res, next) => {
    const { kode } = req.body
    if (!kode) {
      return res.status(500).json({
        message: "Parameter tidak valid"
      })
    }
    bukuModel.deleteOne({ kode })
      .exec()
      .then(buku => {
        if (!buku.n) {
          return res.status(404).json({
            message: "Buku dengan id tersebut tidak tersedia"
          })
        }
        res.status(200).json({
          message: "Sukses mendelete data buku",
          payload: buku
        })
      }).catch(err => {
        res.status(500).json({
          message: "Gagal mendelete data buku",
          error: err
        })
      })
  }
}