
const Book = require('../models/book');
const BorrowTransaction = require('../models/borrowTransaction');
const User = require('../models/user');

const reportController = {
    getInventoryReport: async (req, res) => {
        try {
            const totalBooks = await Book.countDocuments();
            const availableBooks = await Book.countDocuments({ isAvailable: true });
            const reservedBooks = await Book.countDocuments({ reserved: true });
            const booksByGenre = await Book.aggregate([
                { $group: { _id: "$genre", count: { $sum: 1 } } }
            ]);

            res.json({
                totalBooks,
                availableBooks,
                reservedBooks,
                booksByGenre,
            });
        } catch (error) {
            res.status(500).json({ message: 'Error generating inventory report', error });
        }
    },

    getBorrowingStatistics: async (req, res) => {
        try {
            const totalBorrowed = await BorrowTransaction.countDocuments();
            const overdueBooks = await BorrowTransaction.countDocuments({ returnDate: null, dueDate: { $lt: new Date() } });

            res.json({
                totalBorrowed,
                overdueBooks,
            });
        } catch (error) {
            res.status(500).json({ message: 'Error generating borrowing statistics', error });
        }
    },
    getUserActivityReport: async (req, res) => {
        try {
            const users = await User.find().populate('borrowedBooks');
            const userActivity = users.map(user => ({
                userId: user._id,
                name: user.name,
                borrowedBooksCount: user.borrowedBooks.length,
            }));
    
            res.json(userActivity);
        } catch (error) {
            res.status(500).json({ message: 'Error generating user activity report', error });
        }
    }
    
    
    
};

module.exports = reportController;
