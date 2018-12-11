const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ "message": "use user/signin or user/signup to access protected data" })
})
router.post('/signin', userController.signin)
router.post('/signup', userController.signup)

module.exports = router