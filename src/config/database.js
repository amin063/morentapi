const mongoose = require('mongoose')

const database = () => {
    
    mongoose.connect(process.env.MONGO_URI).then(() => console.log("Baglanti basarili"))
        .catch((err) => console.log("asdfasd" + err))

}


module.exports = database