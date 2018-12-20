const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  console.log(req.headers.authorization)

  const authorization = req.headers.authorization ? req.headers.authorization.split(' ') : []

  let Token = authorization[0] === "Bearer" ? authorization[1] : null

  jwt.verify(Token, '1n1p455w0rd', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "auth Required" })
    } else {
      next()
    }
  })
}