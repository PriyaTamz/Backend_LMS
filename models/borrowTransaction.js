const mongoose = require('mongoose');

const BorrowTransactionSchema = new mongoose.Schema({
    "userId": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    "bookId": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    "borrowDate": {
        type: Date,
        default: Date.now,
        required: true
    },
    "dueDate": {
        type: Date,
        required: true
    },
    "returnDate": {
        type: Date
    },
    "lateFee": {
        type: Number,
        default: 0
    },
    "isReserved": { 
        type: Boolean,
        default: false 
    }
});

module.exports = mongoose.model('BorrowTransaction', BorrowTransactionSchema, 'borrowTransactions');