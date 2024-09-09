const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../utils/config');
const user = require('../models/user');

const auth = {
    isAuthenticated: (req, res, next) => {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({mesage: 'Unauthorized'});
        }
        jwt.verify(token, JWT_SECRET, (error, user) => {
            if(error) {
                return res.status(403).json({message: 'Invalid token'});
            }
            req.userId = user.id;
            next();
        });
    }
}

module.exports = auth;