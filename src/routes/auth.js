const express = require('express')
const router = express.Router();
const { login , register, getUser, logout } = require('../controllers/auth')
const auth = require('../middleware/auth')
router.post('/register', register)
router.post('/login', login)
router.get('/profile', auth, getUser)
router.post('/logout', logout)

module.exports = router