const mongoose = require('mongoose')
const transaksiModel = require('../models/transaksiModel')
const bukuModel = require('../models/bukuModel')
const checkoutModel = require('../models/checkoutModel')
const { assign, pick } = require('lodash')

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
              buku: buku,
              idTransaksi: transaksi._id,
              jumlah: transaksi.jumlah
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
    const IDcheckOut = new mongoose.Types.ObjectId()

    const transaksis = req.body.map(data => {
      const removeID = pick(data, ['idBuku', 'kode', 'jumlah'])
      let payload = {
        _id: new mongoose.Types.ObjectId(),
        idBuku: mongoose.Types.ObjectId(data.idBuku),
        idCheckout: IDcheckOut
      }
      return assign(removeID, payload)
    })

    const checkOut = new checkoutModel({
      _id: IDcheckOut
    })

    checkOut.save()// create checkout
      .then(checkOut => {
        let ids = []
        transaksis.map(transaksi => {
          ids = [...ids, transaksi.idBuku]
        })
        bukuModel.find({ _id: { $in: ids } }, (err, result) => { //find
          if (err) {
            checkoutModel.deleteOne({ _id: checkOut._id }, rmvError => {
              if (rmvError) {
                return res.status(500).json({
                  message: "Server error",
                  removeError: rmvError,
                  error: err
                })
              }
              return res.status(500).json({
                message: "Server error",
                error: err
              })
            })
          }

          if (!result.length) {
            checkoutModel.deleteOne({ _id: checkOut._id }, rmvError => {
              if (rmvError) {
                return res.status(500).json({
                  message: "Server error",
                  removeError: rmvError,
                  error: err
                })
              }
              return res.status(404).json({
                message: "Kode buku tidak tersedia",
              })
            })
          }

          let error = []
          transaksis.map(transaksi => {
            result.map(data => {
              if (transaksi.kode == data.kode) {
                if (transaksi.jumlah_buku > data.jumlahBuku) {
                  error = [...error, "Jumlah buku dengan kode " + transaksi.kode + " tidak memenuhi permintaan"]
                }
              }
            })
          })

          if (error.length) {
            checkoutModel.deleteOne({ _id: checkOut._id }, rmvError => {
              if (rmvError) {
                return res.status(500).json({
                  message: "Server error",
                  removeError: rmvError
                })
              }
              return res.status(400).json({
                message: error
              })
            })
          } else {
            transaksis.map(transaksi => {
              result.map(data => {
                if (transaksi.idBuku.equals(data._id)) {

                  if (data.jumlahBuku < transaksi.jumlah) {
                    return error = 403
                  }
                }
              })
            })
          }

          if (error === 403) {
            return res.status(403).json({
              message: "Stock buku tidak memenuhi kebutuhan"
            })
          }

          transaksis.map(transaksi => {
            result.map(data => {
              if (transaksi.idBuku.equals(data._id)) {
                let stock = data.jumlahBuku - transaksi.jumlah
                bukuModel.updateOne({ _id: transaksi.idBuku }, { $set: { jumlahBuku: stock } }, (err, raw) => {
                  if (err) {
                    checkoutModel.deleteOne({ _id: checkOut._id }, rmvError => {
                      if (rmvError) {
                        return res.status(500).json({
                          message: "Server error",
                          removeError: rmvError,
                          error: err
                        })
                      }
                      return res.status(500).json({
                        message: "Server error",
                        error: err
                      })
                    })
                  }
                })
              }
            })
          })

          transaksiModel.insertMany(transaksis, (err, transaksi) => {
            if (err) {
              return res.status(500).json({
                message: "Server error",
                error: err
              })
            }
            res.status(200).json({
              message: "Sukses menambah data transaksi",
              payload: transaksi
            })
          })

        })
      }).catch(err => {
        res.status(500).json({
          error: err
        })
      })
  }
}