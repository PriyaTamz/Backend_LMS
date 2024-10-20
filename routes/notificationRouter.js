const express = require('express');
const notificationController = require('../controllers/notificationController');
const userAuth = require('../utils/userAuth');

const notificationRouter = express.Router();

notificationRouter.post('/', userAuth.isAuthenticated, notificationController.createNotification);
notificationRouter.get('/', userAuth.isAuthenticated, notificationController.getUserNotifications);
notificationRouter.delete('/:id', userAuth.isAuthenticated, notificationController.markAsRead);

module.exports = notificationRouter;





