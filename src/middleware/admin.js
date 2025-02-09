const jwt = require('jsonwebtoken')

const adminAuth = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ msg: 'Token yoxdur' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.admin = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Token etibarsızdır' });
    }
} 

module.exports  = adminAuth