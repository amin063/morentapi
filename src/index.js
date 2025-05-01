// PACKAGES
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.js')
const carRoutes = require('./routes/car.js')
const favRoutes = require('./routes/fav.js')
dotenv.config()
// DATABASE CONNECTIONS
const db = require('./config/database.js');
db()




const app = express()
const corsOptions = {
    // origin: 'https://morent-steel.vercel.app',
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cookieParser());
app.use('/api', authRoutes)
app.use('/api', carRoutes)
app.use('/api', favRoutes)
const PORT = 5000




app.listen(PORT, () => {
    console.log(`${PORT} da isleyir`);
})
