const express = require('express')
const router = express.Router();
const { login, register, getUser, logout, adminLogin, adminProfileUpdate, getAdmin } = require('../controllers/auth')
const adminAuth = require('../middleware/admin')
const auth = require('../middleware/auth')
router.post('/register', register)
router.post('/login', login)
router.get('/profile', auth, getUser)
router.post('/logout', logout)
router.post('/admin', adminLogin)
router.post('/updateAdmin', adminAuth, adminProfileUpdate)
router.get('/getAdmin' , adminAuth , getAdmin)

module.exports = router