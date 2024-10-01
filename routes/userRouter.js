const express = require('express');
const userController = require('../controllers/userController');
const userAuth = require('../utils/userAuth');

const userRouter = express.Router();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.post('/logout', userAuth.isAuthenticated, userController.logout);
userRouter.get('/me', userAuth.isAuthenticated, userController.me);

userRouter.get('/profile', userAuth.isAuthenticated, userController.getUserProfile);
userRouter.patch('/profile', userAuth.isAuthenticated, userController.updateProfile);

userRouter.post('/forgot-password', userAuth.isAuthenticated, userController.requestPasswordReset);
userRouter.post('/verify-otp', userAuth.isAuthenticated, userController.verifyOtp);
userRouter.post('/reset-password', userAuth.isAuthenticated, userController.resetPassword);

module.exports = userRouter;