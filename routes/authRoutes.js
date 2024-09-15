const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../utils/auth');

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', auth.isAuthenticated, authController.me);
authRouter.post('/forgot-password', authController.requestPasswordReset);
authRouter.post('/verify-otp', authController.verifyOtp);
authRouter.post('/reset-password', authController.resetPassword);

module.exports = authRouter;