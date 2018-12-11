const mongoose = require('mongoose')
const transaksiModel = require('../models/transaksiModel')
const bukuModel = require('../models/bukuModel')


module.exports = {
  ambilDataTransaksi: (req, res, next) => {
    transaksiModel.find()
      .populate('idBuku')
      .exec()
      .then(transaksi => {
        if (!transaksi.length) {
          return res.status(204).json()
        }
        res.status(200).json({
          message: "Semua data transaksi",
          length: transaksi.length,
          payload: transaksi.map(buku => {
            return {
              _id: buku.idBuku._id,
              nama_buku: buku.idBuku.namaBuku,
              kode: buku.idBuku.kode,
              jumlah_transaksi: buku.idBuku.jumlahBuku

            }
          })
        })
      }).catch(err => {
        res.status(500).json({
          message: "Gagal mengambil data transaksi",
          error: err
        })
      })
  },

  tambahDataTransaksi: (req, res, next) => {

    const { id_buku, jumlah } = req.body

    const transaksi = new transaksiModel({
      _id: new mongoose.Types.ObjectId,
      idBuku: id_buku,
      jumlah: jumlah
    })

    bukuModel.findOne({ _id: mongoose.Types.ObjectId(id_buku) })
      .exec()
      .then(buku => {
        console.log(buku)
        if (!buku) {
          return res.status(404).json({
            message: "Buku tidak tersedia"
          })
        }

        if (buku.jumlahBuku < jumlah) {
          return res.status(403).json({
            message: "Stok buku tidak memenuhi jumlah permintaan"
          })
        }

        const stock = buku.jumlahBuku - jumlah

        bukuModel.updateOne({ _id: mongoose.Types.ObjectId(id_buku) }, { $set: { jumlahBuku: stock } }, (err, bukutrigger) => {
          if (err) {
            return res.status(500).json({
              message: "Gagal mentrigger data buku"
            })
          }
          transaksi.save()
            .then(transaksi => {
              res.status(200).json({
                message: "Sukses menambah data transaksi",
                trigger: bukutrigger,
                payload: transaksi
              })
            }).catch(err => {
              res.status(500).json({
                message: "Gagal menambah data transaksi",
                erro: err
              })
            })
        })
      }).catch(err => {
        res.status(500).json({
          message: "Gagal menambah data",
          error: err
        })
      })
  }
}