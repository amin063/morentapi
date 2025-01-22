const AuthSchema = require('../models/auth.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const register = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await AuthSchema.findOne({ username })

        if (user) {
            return res.status(400).json({ msg: "Istifadeci adi var" })
        }
        if (username.length < 6) {
            return res.status(422).json({ msg: "Istifadeci adi 6 simvoldan boyuk olmalidir" })
        }
        if (password.length < 6) {
            return res.status(422).json({ msg: "Sifre 6 simvoldan boyuk olmalidir" })
        }
        const passwordHash = await bcrypt.hash(password, 12)
        const newUser = await AuthSchema.create({ username, password: passwordHash })
        const token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            status: 'OK',
            newUser,
            token
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await AuthSchema.findOne({ username })
        if (!user) {
            return res.status(404).json({ message: 'Bele bir sey yoxdu' })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(401).json({ status: 401 })
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        

        res.status(200).json({
            status: "OK",
            user,
            token
        })

    } catch (error) {
        res.status(500).json({ msg: "Error login" })
    }
}

module.exports = { register, login }