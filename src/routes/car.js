const express = require('express')
const router = express.Router();
const {addCar, getCars, getCarDetails, filterCars, deleteCar} = require('../controllers/car.js')

router.post('/add', addCar)
router.get('/cars', getCars)
router.get('/details/:id', getCarDetails)
router.get('/filter', filterCars)
router.delete('/delete/:id', deleteCar)

module.exports = router