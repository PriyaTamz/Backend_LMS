const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { JWT_SECRET } = require('../utils/config');

// Utility function to generate a random string
function randString() {
    const length = 8;
    let randStr = '';
    for (let i = 0; i < length; i++) {
        const ch = Math.floor((Math.random() * 10) + 1);
        randStr += ch;
    }
    return randStr;
}

// Function to send the reset email
function sendResetEmail(email, token) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vishnupriyatk1996@gmail.com', // Replace with your email
            pass: 'pumk wlqi cowy urjh'         // Replace with your email password or app-specific password
        }
    });

    const mailOptions = {
        from: 'vishnupriyatk1996@gmail.com',
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

const authController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ name, email, password: hashedPassword }); // 123456
            const savedUser = await newUser.save();
            res.status(201).json({ message: 'User Register Successfully', user: savedUser });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const userExists = await User.findOne({ email });
            if (!userExists) {
                return res.status(400).json({ message: 'User not found' });
            }
            const passwordMatch = await bcrypt.compare(password, userExists.password); // 12345
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Incorrect password' });
            }
            const token = jwt.sign({ id: userExists._id }, JWT_SECRET, { expiresIn: '3h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: "true",
                samesite: "None"
            });
            res.status(200).json({ message: 'User Logged in Successfully', userExists });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'User Logged out Successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    me: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId).select('-password -createdAt -updatedAt');
            res.status(200).json(user);
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

            // Generate a random reset token and set its expiration time (e.g., 1 hour)
            const resetToken = randString();
            user.resetToken = resetToken;
            user.resetTokenExpires = Date.now() + 3600000; // 1 hour from now

            await user.save();

            // Send the reset email with the token
            sendResetEmail(user.email, resetToken);
            res.status(200).json({ message: 'Password reset link has been sent to your email' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Method to handle password reset form submission
    resetPassword: async (req, res) => {
        try {
            const { token, newPassword } = req.body;
            console.log(`Received token: ${token}`);
            const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });

            if (!user) {
                console.log(`Invalid token or token expired.`);
                return res.status(400).json({ message: 'Invalid or expired reset token' });
            }

            // Hash the new password and save it
            user.password = await bcrypt.hash(newPassword, 10);
            user.resetToken = undefined; // Clear the reset token
            user.resetTokenExpires = undefined; // Clear the token expiration

            await user.save();

            res.status(200).json({ message: 'Password has been reset successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = authController;