const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userModel = require('../models/userModel')

module.exports = {
  signup: (req, res, next) => {
    const user = new userModel({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: req.body.password
    })
    user.save()
      .then(result => {
        res.status(200).json({
          message: "User baru berhasil terdaftar",
          payload: result
        })
      }).catch(err => {
        if (err.code === 11000) {
          return res.status(422).json({
            message: "Email sudah terdaftar!",
            error: err
          })
        }
        res.status(500).json({
          message: "Gagal mendaftarkan user baru!",
          error: err
        })
      })
  },

  signin: (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      res.status(401).json({
        message: "Form tidak boleh kosong!"
      })
    }
    userModel.findOne({ email: req.body.email })
      .exec()
      .then(user => {
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
          if (err) {
            return res.status(500).json({
              error: err
            })
          }

          if (isMatch) {
            const token = jwt.sign({ data: req.body.email }, '1n1p455w0rd', { expiresIn: '1h' })

            return res.status(200).json({
              tokenID: token
            })
          }
          res.status(401).json({
            message: "Email dan password anda tidak cocok",
            error: err
          })
        })
      }).catch(err => {
        res.status(500).json({
          message: "User tidak ada",
          error: err
        })
      })
  }
}