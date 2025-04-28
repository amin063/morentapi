const AuthSchema = require('../models/auth.js');
const AdminSchema = require('../models/admin.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await AuthSchema.findOne({ username });

    if (user) {
      return res.status(400).json({ msg: "İstifadəçi adı mövcuddur." });
    }

    if (username.length < 6 || password.length < 6) {
      return res.status(422).json({ msg: "İstifadəçi adı və şifrə minimum 6 simvol olmalıdır." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await AuthSchema.create({ username, password: passwordHash });

    const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ status: 'OK', newUser, token });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await AuthSchema.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı.' });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      return res.status(401).json({ message: "Yanlış şifrə və ya istifadəçi adı." });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '5h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 5 * 60 * 60 * 1000 // 5 hours
    });

    res.status(200).json({ status: "OK", user, token });
  } catch (error) {
    res.status(500).json({ msg: "Error login" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
    res.status(200).json({ msg: 'Uğurla çıxış edildi.' });
  } catch (error) {
    res.status(500).json({ msg: "Server xətası." });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await AdminSchema.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: "Admin tapılmadı!" });
    }

    const passwordCompare = await bcrypt.compare(password, admin.password);

    if (!passwordCompare) {
      return res.status(401).json({ message: "Şifrə yanlışdır!" });
    }

    const token = jwt.sign({ username, id: admin.id }, process.env.JWT_SECRET, { expiresIn: "5h" });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 5 * 60 * 60 * 1000
    });

    res.status(200).json({ status: "OK", admin, token });
  } catch (error) {
    res.status(500).json({ msg: "Error login" });
  }
};

const adminProfileUpdate = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await AdminSchema.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin tapılmadı!" });
    }

    if (username.length < 5 || password.length < 5) {
      return res.status(400).json({ message: "İstifadəçi adı və şifrə ən az 5 simvoldan ibarət olmalıdır." });
    }

    const passwordHashed = await bcrypt.hash(password, 10);
    admin.username = username;
    admin.password = passwordHashed;
    await admin.save();

    // Şifre değiştiği için mevcut tokenı iptal et
    res.clearCookie("token");

    res.status(200).json({ status: "OK", message: "Profil yeniləndi. Yenidən daxil olun!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Profil yenilənərkən xəta baş verdi!" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await AuthSchema.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'İstifadəçi tapılmadı.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ msg: "Server xətası." });
  }
};

const getAdmin = async (req, res) => {
  try {
    const admin = await AdminSchema.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ msg: 'Admin tapılmadı.' });
    }
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ msg: "Server xətası." });
  }
};

module.exports = { register, login, logout, getUser, adminLogin, adminProfileUpdate, getAdmin };
