const express = require('express');
const bookRouter = require('./routes/bookRouter');
const adminRouter = require('./routes/adminRouter');
const userRouter = require('./routes/userRouter');
const reportRouter = require('./routes/reportRouter');
const notificationRouter = require('./routes/notificationRouter'); 
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'https://heroic-faloodeh-f3be09.netlify.app',
    //origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(cookieParser());

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/reports', reportRouter);
app.use('/notifications', notificationRouter);

module.exports = app;