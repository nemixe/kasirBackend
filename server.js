const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const userRoute = require('./api/routes/userRoute')
const bukuRoute = require('./api/routes/bukuRoute')
const transaksiRoute = require('./api/routes/transaksiRoute')
const app = express()

mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://127.0.0.1:27017/kasir', { useNewUrlParser: true })

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);


  // Pass to next layer of middleware
  next();
})

app.use('/user', userRoute)
app.use('/buku', bukuRoute)
app.use('/transaksi', transaksiRoute)

app.listen(8080, () => {
  console.log("success")
})