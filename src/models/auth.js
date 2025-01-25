const mongoose = require('mongoose')

const AuthSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    favList: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'cars'
    }
    ]
})


module.exports = mongoose.model('users', AuthSchema)