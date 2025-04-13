const CarSchema = require('../models/car.js')
const addCar = async (req, res) => {
    try {
        const { name, img, desc, type, capacity, driveType, fuelCapacity, price } = req.body

        const newCar = new CarSchema({ name, img, desc, type, capacity, driveType, fuelCapacity, price })
        newCar.rentDetails = null;
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
        const { page = 1, limit = 10 } = req.query
        const skip = (page - 1) * limit;

        const carLists = await CarSchema.find()
            .skip(skip)
            .limit(parseInt(limit));

        const totalCars = await CarSchema.countDocuments();
        if (carLists.length === 0) {
            return res.status(404).json({ message: "Heç bir maşın tapılmadı" });
        }

        res.status(200).json({
            status: "OK",
            totalCars,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCars / limit),
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

        if (type) {
            const typeArray = Array.isArray(type) ? type : [type];
            filter.type = { $in: typeArray };
        }

        if (capacity) {
            const capacityArray = Array.isArray(capacity) ? capacity : [capacity];
            filter.capacity = { $in: capacityArray };
        }

        if (price) {
            const parsedPrice = parseFloat(price);
            if (!isNaN(parsedPrice)) {
                filter.price = { $lte: parsedPrice };
            } else {
                return res.status(400).json({ message: "Price düzgün rəqəm olmalıdır" });
            }
        }


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
        const { _id, rentDay, name, address, number, city, cardNumber, cardHolder, cardDate, cardCvc, total, confirmation } = req.body
        const car = await CarSchema.findById(_id)
        if (!car) {
            return res.status(404).json({ message: "Bu ID ilə maşın tapılmadı" })
        }
        if (car.rentDetails.name) {
            return res.status(400).json({ aaa: car.rentDetails, message: "Bu maşın artıq kirayədədir" });
        }

        if (rentDay < 1) {
            return res.status(400).json({ message: "Kiralama günləri 1-dən kiçik ola bilməz" })
        }
        if (rentDay > 30) {
            return res.status(400).json({ message: "Kiralama günləri 30-dan böyük ola bilməz" })
        }
        if (!name || !address || !number || !city || !cardNumber || !cardHolder || !cardDate || !cardCvc || !total) {
            return res.status(400).json({ message: "Bütün xanaları doldurun" })
        }
        if (!confirmation) {
            return res.status(400).json({ message: "Təsdiq xanasını düzgün doldurun" })
        }



        car.rentDay = rentDay;
        car.rentDetails = {
            name, address, number, city, cardNumber, cardHolder, cardDate, cardCvc, total, confirmation
        }
        car.rentHistory.push({ carName: car.name, carImg: car.img, username: name, rentDay, number, total })
        await car.save();

        res.status(200).json({
            status: "OK",
            message: "Maşın uğurla kirayəyə verildi",
            car
        });
    }
    catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        });
    }
}

const getAllRentHistory = async (req, res) => {
    try {
        const cars = await CarSchema.find();
        let totalEarnings = 0;
        let rentedCars = [];

        cars.forEach(car => {
            if (car.rentHistory.length > 0) {
                rentedCars.push(...car.rentHistory);
                car.rentHistory.forEach(rent => {
                    totalEarnings += rent.total;
                });
            }
        });

        res.status(200).json({
            status: "OK",
            totalEarnings,
            rentedCars
        });

    } catch (error) {
        res.status(400).json({
            status: "Error",
            message: error.message
        });
    }
};

const withdrawalCar = async (req, res) => {
    try {
        const { _id } = req.body;

        const car = await CarSchema.findById(_id);

        if (!car) {
            return res.status(404).json({ message: "Belə maşın yoxdur" });
        }

        car.rentDetails = null;
        await car.save();

        res.status(200).json({
            status: "OK",
            message: "Təhvil alındı",
            car
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
};



module.exports = { addCar, getCars, getCarDetails, filterCars, deleteCar, rentCar, getAllRentHistory, withdrawalCar }