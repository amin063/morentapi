const CarSchema = require('../models/car.js')
const addCar = async (req, res) => {
    try {
        const { name, img, desc, type, capacity, driveType, fuelCapacity, price } = req.body

        const newCar = new CarSchema({ name, img, desc, type, capacity, driveType, fuelCapacity, price })

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
        const { type, capacity, price } = req.query;
        const filter = {};

        // Type üçün filtr
        if (type) {
            const typeArray = Array.isArray(type) ? type : [type]; // Tək dəyər də gəlsə, array-a çeviririk
            filter.type = { $in: typeArray }; // Type array ilə uyğun gələnlər
        }

        // Capacity üçün filtr
        if (capacity) {
            const capacityArray = Array.isArray(capacity) ? capacity : [capacity];
            filter.capacity = { $in: capacityArray }; // Capacity array ilə uyğun gələnlər
        }

        // Price üçün filtr (<=)
        if (price) {
            const parsedPrice = parseFloat(price); // Price dəyərini rəqəmə çevir
            if (!isNaN(parsedPrice)) {
                filter.price = { $lte: parsedPrice }; // Price, verilən dəyərdən kiçik və ya bərabər olmalı
            } else {
                return res.status(400).json({ message: "Price düzgün rəqəm olmalıdır" });
            }
        }

        // Filterə uyğun maşınları tap
        const cars = await CarSchema.find(filter);

        if (cars.length === 0) {
            return res.status(404).json({ message: "Heç bir maşın tapılmadı" });
        }

        // Uğurlu cavab
        res.status(200).json({
            status: "OK",
            cars,
        });
    } catch (error) {
        // Səhv cavab
        res.status(400).send({
            status: "Error",
            message: error.message,
        });
    }
};



const rentCar = async (req, res) => {
    try {
        const { _id, rentDay } = req.body
        const car = await CarSchema.findById(_id)
        if (!car) {
            return res.status(404).json({ message: "Bu ID ilə maşın tapılmadı" })
        }
        if (car.isActive === false) {
            return res.status(400).json({ message: "Bu maşın artıq kirayədədir" })
        }
        car.isActive = false;
        car.rentDay = rentDay;
        await car.save();

        res.status(200).json({
            status: "OK",
            message: "Maşın uğurla kirayəyə verildi",
            car
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = { addCar, getCars, getCarDetails, filterCars, deleteCar, rentCar }