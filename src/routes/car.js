const express = require('express')
const router = express.Router();
const { addCar, getCars, getCarDetails, filterCars, deleteCar, rentCar, getAllRentHistory, withdrawalCar } = require('../controllers/car.js');
const auth = require('../middleware/auth.js');
const adminAuth = require('../middleware/admin.js')

router.get('/cars', getCars)
router.get('/details/:id', getCarDetails)
router.get('/filter', filterCars)
router.post('/rent', auth, rentCar)
router.get('/getHistory', adminAuth, getAllRentHistory)
router.post('/add', adminAuth, addCar)
router.delete('/delete/:id', adminAuth, deleteCar)
router.post('/withdrawalCar', adminAuth, withdrawalCar)

module.exports = router