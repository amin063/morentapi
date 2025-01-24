const express = require('express')
const router = express.Router();
const {addCar, getCars, getCarDetails, filterCars, deleteCar, rentCar} = require('../controllers/car.js');
const auth = require('../middleware/auth.js');

router.post('/add', addCar)
router.get('/cars', auth , getCars)
router.get('/details/:id', auth , getCarDetails)
router.get('/filter', auth , filterCars)
router.post('/rent', auth , rentCar)
router.delete('/delete/:id', auth , deleteCar)

module.exports = router