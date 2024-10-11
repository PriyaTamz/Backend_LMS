const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');
const User = require('../models/user'); 
const BorrowTransaction = require('../models/borrowTransaction'); 

const userAuth = {
    isAuthenticated: (req, res, next) => {
        try {
            console.log('Request headers:', req.headers); 

            const token = req.cookies.token; 
            if (!token) {
                console.log('No token found in cookies');
                return res.status(401).json({ message: 'Unauthorized' });
            }
            
            /*const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
    
            const token = authHeader.split(" ")[1];  
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }*/
    
            jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
                if (error) {
                    return res.status(403).json({ message: 'Invalid token' });
                }
                req.userId = user.id;
                req.user = user;
                next();
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
};

module.exports = userAuth;
