const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    img: {
        type: String,
        required: true,
        trim: true,
        match: /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i 
    },
    desc: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
    },
    driveType : {
        type: String,
        required: true,
        trim: true
    },
    fuelCapacity : {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    rentDay: {
        type: Number,
        min: 1
    },
    rentUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }
});

module.exports = mongoose.model('car', CarSchema);
