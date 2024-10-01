const { default: mongoose } = require("mongoose");

const adminSchema = new mongoose.Schema({
    "name": String,
    "email": String,
    "password": String,
    "role": {
        type: String,
        enum: ['admin', 'user']
    },
    "createdAt": {
        type: Date,
        default: Date.now
    },
    "updatedAt": {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Admin', adminSchema, 'admin');