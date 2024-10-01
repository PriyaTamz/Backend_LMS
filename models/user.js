const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    "name": String,
    "email": String,
    "password": String,
    "role": {
        type: String,
        enum: ['admin', 'librarian', 'user']
    },
    "resetToken": String,              
    "resetTokenExpires": Date,
    "createdAt": {
        type: Date,
        default: Date.now
    },
    "updatedAt": {
        type: Date,
        default: Date.now
    },
    "borrowedBooks": [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BorrowTransaction' 
    }]
});

module.exports = mongoose.model('User', userSchema, 'users');