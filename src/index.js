// PACKAGES
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const authRoutes = require('./routes/auth.js')
const carRoutes = require('./routes/car.js')
dotenv.config()
// DATABASE CONNECTIONS
const db = require('./config/database.js')
db()




const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use('/api', authRoutes)
app.use('/api', carRoutes)
const PORT = 5000



app.listen(PORT, () => {
    console.log(`${PORT} da isleyir`);
})