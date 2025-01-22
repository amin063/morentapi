const express = require('express')
const router = express.Router();
const {addCar, getCars, getCarDetails, filterCars, deleteCar} = require('../controllers/car.js');
const auth = require('../middleware/auth.js');

router.post('/add', auth , addCar)
router.get('/cars', auth , getCars)
router.get('/details/:id', auth , getCarDetails)
router.get('/filter', auth , filterCars)
router.delete('/delete/:id', auth , deleteCar)

module.exports = router