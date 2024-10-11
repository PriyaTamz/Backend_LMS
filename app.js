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
    origin: '*',
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