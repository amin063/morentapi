const express = require('express');
const router = express.Router();
const { addFav, getFavCars } = require('../controllers/fav.js')

router.post('/addFav', addFav)
router.post('/getFavCars', getFavCars)

module.exports = router