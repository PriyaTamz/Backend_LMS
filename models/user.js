const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: [true, 'Name is rquired'],
        trim: true
    },
    "email": {
        type: String,
        required: [true, 'Email is rquired'],
        unique: true, 
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
    },
    "password": {
        type: String,
        required: [true, 'Password is required'],  
        minlength: [6, 'Password must be at least 6 characters']
    },
    "role": {
        type: String,
        enum: ['admin', 'librarian', 'user'],
        default: 'user'  
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