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
    steering: {
        type: String,
        required: true,
        trim: true
    },
    gasoline: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    }
});

module.exports = mongoose.model('car', CarSchema);
