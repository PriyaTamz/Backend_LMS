const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');
const User = require('../models/user');
const BorrowTransaction = require('../models/borrowTransaction');

const userAuth = {
    /*isAuthenticated: (req, res, next) => {
        try {
            console.log('Request headers:', req.headers); 

            /*const token = req.cookies.token; 
            if (!token) {
                console.log('No token found in cookies');
                return res.status(401).json({ message: 'Unauthorized' });
            }*/

    /*const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
 
    const token = authHeader.split(" ")[1];  
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
 
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
}*/
    isAuthenticated: (req, res, next) => {
        try {
            console.log('Request headers:', req.headers); 

            const authHeader = req.headers.authorization;
            if (!authHeader) {
                console.log('Authorization header missing');
                return res.status(401).json({ message: 'Unauthorized: Authorization header missing' });
            }

            const token = authHeader.split(" ")[1]; 
            if (!token) {
                console.log('Token missing from Authorization header');
                return res.status(401).json({ message: 'Unauthorized: Token missing' });
            }

            console.log('Extracted token:', token);

            jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
                if (error) {
                    console.log('Token verification failed:', error); 
                    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
                }
                console.log('Verified user:', user); 

                req.userId = user.id;
                req.user = user;  
                next(); 
            });
        } catch (error) {
            console.error('Authentication middleware error:', error); 
            res.status(500).json({ message: 'Internal Server Error: ' + error.message });
        }
    }


};

module.exports = userAuth;
