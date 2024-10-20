const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');
const Admin = require('../models/admin');

const auth = {
    isAuthenticated: (req, res, next) => {
        try {
            console.log('Request headers:', req.headers);

            let token;

            // Check if token is provided in cookies
            if (req.cookies && req.cookies.token) {
                token = req.cookies.token;
            } else {
                // Check if Authorization header exists
                const authHeader = req.headers.authorization;
                if (authHeader) {
                    token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
                }
            }

            // If no token is found, return unauthorized error
            if (!token) {
                console.log('No token found in cookies or Authorization header');
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Verify the token
            jwt.verify(token, process.env.JWT_SECRET, (error, admin) => {
                if (error) {
                    return res.status(403).json({ message: 'Invalid token' });
                }
                req.adminId = admin.id;
                req.admin = admin;
                next();
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    /*isAuthenticated: (req, res, next) => {
        try {
            console.log('Request headers:', req.headers); 

            const authHeader = req.headers.authorization;
            if (!authHeader) {
                console.log('No auth header found');
                return res.status(401).json({ message: 'Unauthorized' });
            }
    
            const token = authHeader.split(" ")[1]; 
            if (!token) {
                console.log('Token not found in auth header');
                return res.status(401).json({ message: 'Unauthorized' });
            }
    
            jwt.verify(token, process.env.JWT_SECRET, (error, admin) => {
                if (error) {
                    return res.status(403).json({ message: 'Invalid token' });
                }
                req.adminId = admin.id; 
                req.admin = admin; 
                next();
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },*/
    isAdmin: async (req, res, next) => {
        try {
            const { adminId } = req;
            if (!adminId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const admin = await Admin.findById(adminId);
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }

            if (admin.role !== 'admin') {
                return res.status(403).json({ message: 'Forbidden' });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = auth;
