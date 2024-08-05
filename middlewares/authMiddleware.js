// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded.user;
        // console.log(decoded)

        // Optionally, you can fetch the user details from the database if needed
        const user = await User.findById(decoded.userId).select('+role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } else if (user.role !== 'admin' && req.path.includes('/admin')) {
            return res.status(403).json({ message: 'Forbidden access' });
        }
        req.user = user;

        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
