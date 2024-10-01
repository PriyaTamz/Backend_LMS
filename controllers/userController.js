const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { JWT_SECRET } = require('../utils/config');
const BorrowTransaction = require('../models/borrowTransaction'); 
const Book = require('../models/book');

function randString() {
    const length = 8;
    let randStr = '';
    for (let i = 0; i < length; i++) {
        const ch = Math.floor((Math.random() * 10) + 1);
        randStr += ch;
    }
    return randStr;
}

function sendResetEmail(email, token) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        text: `Please reset your password by clicking the link: http://localhost:3001/auth/reset-password/${token}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error sending email:', err);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

const userController = {
    register: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;
            if (role !== 'user') {
                return res.status(400).json({ message: 'Role must be user.' });
            }

            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({ name, email, password: hashedPassword, role });
            await newUser.save();

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
    
            if (!user || user.role !== 'user') {
                return res.status(404).json({ message: 'Invalid credentials or not an user' });
            }
    
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Incorrect password' });
            }
    
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    
            
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            });
    
           
            res.status(200).json({ message: 'User logged in successfully', token, userId: user._id });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    logout: async (req, res) => {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'User logged out successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    me: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId).select('-_id -email -password -__v -createdAt -updatedAt');
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getUserProfile: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId).select('-_id -password -__v -createdAt -updatedAt');

            const borrowingHistory = await BorrowTransaction.find({ userId })
            .populate('bookId', 'title dueDate')
            .select('borrowDate dueDate returnDate lateFee');

            const reservedBooks = await Book.find({ reservedBy: userId }).select('title');

            const booksBorrowed = borrowingHistory.map(transaction => ({
                bookTitle: transaction.bookId.title,
                dueDate: transaction.dueDate,
                returnDate: transaction.returnDate,
                lateFee: transaction.lateFee
            }));

            const overdueBooks = borrowingHistory
            .filter(transaction => !transaction.returnDate && transaction.dueDate < new Date())
            .map(transaction => ({
                bookTitle: transaction.bookId.title,
                dueDate: transaction.dueDate
            }));

            res.status(200).json({
                user,
                borrowingHistory,
                reservedBooks,
                booksBorrowed,
                overdueNotifications: overdueBooks
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateProfile: async (req, res) => {
        try {
            const userId = req.userId;
            const { name, email } = req.body;

            const updatedUser = await User.findByIdAndUpdate(userId, { name, email }, { new: true });
            res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    requestPasswordReset: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const resetToken = randString();
            user.resetToken = resetToken;
            user.resetTokenExpires = Date.now() + 3600000;

            await user.save();

            sendResetEmail(user.email, resetToken);
            res.status(200).json({ message: 'Password reset link has been sent to your email' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    verifyOtp: async (req, res) => {
        try {
            const { otp } = req.body;
            console.log(`Received OTP: ${otp}`);

            const user = await User.findOne({
                resetToken: otp,
                resetTokenExpires: { $gt: Date.now() }
            });

            console.log(user);

            if (!user) {
                console.log(`Invalid OTP or OTP expired.`);
                return res.status(400).json({ message: 'Invalid or expired reset OTP' });
            }

            console.log(`OTP verified. Returning OTP to client.`);

            res.status(200).json({ message: 'OTP verified successfully. You can now reset your password.', otp });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { token, newPassword, confirmPassword } = req.body;

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }

            const user = await User.findOne({
                resetToken: token,
                resetTokenExpires: { $gt: Date.now() }
            });

            if (!user) {
                console.log(`Invalid token or token expired.`);
                return res.status(400).json({ message: 'Invalid or expired reset token' });
            }

            user.password = await bcrypt.hash(newPassword, 10);

            user.resetToken = undefined;
            user.resetTokenExpires = undefined;

            await user.save();

            res.status(200).json({ message: 'Password has been reset successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}


module.exports = userController;