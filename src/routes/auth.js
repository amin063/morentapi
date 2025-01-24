const express = require('express')
const router = express.Router();
const { login , register, getUser } = require('../controllers/auth')
const auth = require('../middleware/auth')
router.post('/register', register)
router.post('/login', login)
router.get('/profile', auth, getUser)

module.exports = router