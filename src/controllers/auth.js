const AuthSchema = require('../models/auth.js')
const AdminSchema = require('../models/admin.js')
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
        const userIp = req.ip || req.connection.remoteAddress;
        console.log(userIp);

        if (!passwordCompare) {
            return res.status(401).json({ message: "Yanlış şifrə və ya istifadəçi" })
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '5h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 3600000 // 1 hour
        })

        res.status(200).json({
            status: "OK",
            user,
            token
        })

    } catch (error) {
        res.status(500).json({ msg: "Error login" })
    }
}

const getUser = async (req, res) => {
    try {
        const user = await AuthSchema.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Bele bir sey yoxdu' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ msg: "Server Xetasi" });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        
        res.status(200).json({ msg: 'Ugurla cixis edildi' });
    } catch (error) {
        res.status(500).json({ msg: "Server Xetasi" });
    }
}

const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body
        const admin = await AdminSchema.findOne({ username })
        const userIp = req.ip || req.connection.remoteAddress;
        const hhh = await bcrypt.hash("admin1234", 10)
        console.log(hhh);
        console.log("Admin ucun giris edilmeye calisir. \n IP ADRESI: " + userIp);
        if (!admin) {
            return res.status(404).json({ message: "Admin tapılmadı!" });
        }
        const passwordCompare = await bcrypt.compare(password, admin.password)
        if (!passwordCompare) {
            return res.status(401).json({ message: "Şifrə yanlışdır!" });
        }
        const token = jwt.sign({ username, id: admin.id }, process.env.JWT_SECRET, { expiresIn: "5h" })


        console.log("Admin giriş etdi!!!!");
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 3600000
        })
        res.status(200).json({
            status: "OK",
            admin,
            token
        })
    } catch (error) {
        res.status(500).json({ msg: "Error login" })
    }
}

const adminProfileUpdate = async (req, res) => {
    try {
        const { username, password } = req.body
        console.log(req.admin.id);

        const admin = await AdminSchema.findById(req.admin.id)
        if (!admin) {
            return res.status(404).json({ message: "Admin tapılmadı!" });
        }
        if (username.length < 5) {
            return res.status(400).json({ message: "İstifadəçi adı ən az 5 simvoldan ibarət olmalıdır." });
        }
        if (password.length < 5) {
            return res.status(400).json({ message: "Şifrə ən az 5 simvoldan ibarət olmalıdır." });
        }
        const passwordHashed = await bcrypt.hash(password, 10)
        admin.username = username
        admin.password = passwordHashed
        await admin.save()
        const updatedAdmin = {
            username: admin.username,
            id: admin._id,
        };
        res.status(200).json({
            status: "OK",
            admin: updatedAdmin
        });
    } catch (error) {
        res.status(500).json({ message: "Profil yenilənərkən xəta baş verdi!" });
    }
}

const getAdmin = async (req, res) => {
    try {
        const admin = await AdminSchema.findById(req.admin.id)
        if (!admin) {
            return res.status(404).json({ msg: 'Bele bir sey yoxdu' });
        }
        res.status(200).json({ admin });
    } catch (error) {
        res.status(500).json({ msg: "Server Xetasi" });

    }
}
module.exports = { register, login, getUser, logout, adminLogin, adminProfileUpdate, getAdmin }