const Notification = require('../models/Notification');

const notificationController = {
    createNotification: async (req, res) => {
        try {
            const { userId, message } = req.body;
            const notification = new Notification({ userId, message });
            await notification.save();
            res.status(201).json({ success: true, notification });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getUserNotifications: async (req, res) => {
        try {
            const userId = req.user.id;
            const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(1);;
            res.status(200).json({ success: true, notifications });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    markAsRead: async (req, res) => {
        try {
            const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
            res.status(200).json({ success: true, notification });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

};

module.exports = notificationController;