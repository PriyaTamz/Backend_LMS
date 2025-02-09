const express = require('express');
const bookRouter = require('./routes/bookRouter');
const adminRouter = require('./routes/adminRouter');
const userRouter = require('./routes/userRouter');
const reportRouter = require('./routes/reportRouter');
const notificationRouter = require('./routes/notificationRouter'); 
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Dynamically handle allowed origins for CORS
const allowedOrigins = [
    'http://localhost:5173', // Local frontend
    'https://heroic-faloodeh-f3be09.netlify.app' // Deployed frontend
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(cookieParser());

// Define routes
app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/reports', reportRouter);
app.use('/notifications', notificationRouter);

module.exports = app;
