const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
    name: String,
    img: String,
    desc: String,
    type: String,
    capacity: Number,
    driveType: String,
    fuelCapacity: Number,
    price: Number,
    rentDetails: {
        name: String,
        address: String,
        number: String,
        city: String,
        cardNumber: String,
        cardHolder: String,
        cardDate: String,
        cardCvc: String,
        total: Number,
        confirmation: Boolean,
        date: { type: Date, default: Date.now }
    },
    rentHistory: [{
        carName: String,
        carImg: String,
        username: String,
        rentDay: Number,
        number: String,
        total: Number,
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model("Car", CarSchema);
