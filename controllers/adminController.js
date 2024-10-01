const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Book = require('../models/book');
const BorrowTransaction = require('../models/borrowTransaction');

const adminController = {
    register: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;
            if (role !== 'admin') {
                return res.status(400).json({ message: 'Role must be admin.' });
            }

            const adminExists = await Admin.findOne({ email });
            if (adminExists) {
                return res.status(400).json({ message: 'Admin already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newAdmin = new Admin({ name, email, password: hashedPassword, role });
            await newAdmin.save();

            res.status(201).json({ message: 'Admin registered successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const admin = await Admin.findOne({ email });

            if (!admin || admin.role !== 'admin') {
                return res.status(404).json({ message: 'Invalid credentials or not an admin' });
            }

            const passwordMatch = await bcrypt.compare(password, admin.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Incorrect password' });
            }

            const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET);
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
            });

            res.status(200).json({ message: 'Admin logged in successfully', token, adminId: admin._id });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'Admin logged out successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    me: async (req, res) => {
        try {
            const adminId = req.adminId;
            const admin = await Admin.findById(adminId).select('-_id -email -password -__v -createdAt -updatedAt');
            res.status(200).json(admin);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAdminProfile: async (req, res) => {
        try {
            const adminId = req.adminId;
            const admin = await Admin.findById(adminId).select('-_id -password -__v -createdAt -updatedAt');

            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }

            res.status(200).json({ admin });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteReview: async (req, res) => {
        try {
            const { bookId, reviewId } = req.params;

            const book = await Book.findById(bookId);
            if (!book) {
                return res.status(404).json({ message: 'Book not found.' });
            }

            const updatedReviews = book.reviews.filter(review => review._id.toString() !== reviewId);
            if (updatedReviews.length === book.reviews.length) {
                return res.status(404).json({ message: 'Review not found.' });
            }

            book.reviews = updatedReviews;
            await book.save();

            res.status(200).json({ message: 'Review removed successfully.' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    sendAnnouncement: async (req, res) => {
        const { message } = req.body;

        try {
            const users = await User.find();
            await Promise.all(users.map(user => {
                return Notification.create({
                    userId: user._id,
                    message
                });
            }));

            res.status(200).json({ success: true, message: 'Announcement sent to all users.' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}


module.exports = adminController;