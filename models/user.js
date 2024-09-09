const {default: mongoose} = require("mongoose");

const userSchema = new mongoose.Schema({
    "name": String,
    "email": {
        type: String,
        unique: true,
        required: true,
    },
    "password": String,
    "resetToken": String,              
    "resetTokenExpires": Date,
    "createdAt": {
        type: Date,
        default: Date.now
    },
    "updatedAt": {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema, 'users');