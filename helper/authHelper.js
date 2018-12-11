const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  jwt.verify(req.headers.token, '1n1p455w0rd', (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "auth Required" })
    } else {
      next()
    }
  })
}