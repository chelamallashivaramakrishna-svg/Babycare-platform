const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                const Child = require('../models/Child');
                const child = await Child.findById(decoded.id);
                if (child) {
                    req.user = {
                        _id: child._id,
                        name: child.name,
                        role: 'child',
                        family: child.family,
                    };
                }
            }
            if (!req.user) throw new Error('User not found');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'support') { // Assuming support is admin-like
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as support' });
    }
};

module.exports = { protect, admin };
