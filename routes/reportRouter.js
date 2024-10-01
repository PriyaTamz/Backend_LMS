const express = require('express');
const reportController = require('../controllers/reportController');
const adminAuth = require('../utils/adminAuth');

const reportRouter = express.Router();

reportRouter.get('/inventory', adminAuth.isAuthenticated, adminAuth.isAdmin, reportController.getInventoryReport);
reportRouter.get('/borrowing-statistics', adminAuth.isAuthenticated, adminAuth.isAdmin, reportController.getBorrowingStatistics);
reportRouter.get('/user-activity', adminAuth.isAuthenticated, adminAuth.isAdmin, reportController.getUserActivityReport);


module.exports = reportRouter;