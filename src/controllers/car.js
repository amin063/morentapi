const CarSchema = require('../models/car.js')
const addCar = async (req, res) => {
    try {
        const { name, img, desc, type, capacity, steering, gasoline, price } = req.body

        const newCar = new CarSchema({ name, img, desc, type, capacity, steering, gasoline, price })

        await newCar.save()

        res.status(201).json({
            status: "OK",
            newCar
        })

    } catch (error) {
        res.status(400).json({
            status: "Error",
            message: error.message
        })
    }
}

const getCars = async (req, res) => {
    try {
        const carLists = await CarSchema.find()
        if (carLists.length === 0) {
            return res.status(404).json({ message: "Heç bir maşın tapılmadı" });
        }
        res.status(200).json({
            status: "OK",
            carLists
        })
    } catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        })
    }

}

const deleteCar = async (req, res) => {
    try {
        const { id } = req.params
        const car = await CarSchema.findByIdAndDelete(id)
        if (!car) {
            return res.status(404).json({ message: "Bu ID ilə maşın tapılmadı" });
        }
        res.status(200).json({
            status: "OK",
            message: "Maşın uğurla silindi"
        });
    } catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
}

const getCarDetails = async (req, res) => {

    try {
        const { id } = req.params
        const car = await CarSchema.findById(id)
        if (!car) {
            return res.status(404).json({ message: "Bu ID ilə maşın tapılmadı" });
        }
        res.status(200).json({
            status: "OK",
            car
        });
    } catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }

}

const filterCars = async (req, res) => {
    try {
        const { type, capacity, price } = req.query
        const filter = {}
        filter.type = type ? type : undefined
        filter.capacity = capacity ? capacity : undefined
        filter.price = price ? price : undefined

        for (key in filter) {
            if (filter[key] === undefined) {
                delete filter[key]
            }
        }

        const cars = await CarSchema.find(filter)

        if (cars.length === 0) {
            return res.status(404).json({ message: "Heç bir maşın tapılmadı" });
        }

        res.status(200).json({
            status: "OK",
            cars
        })
    } catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        })
    }

}

module.exports = { addCar, getCars, getCarDetails, filterCars, deleteCar }