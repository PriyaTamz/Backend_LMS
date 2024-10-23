const { default: mongoose } = require("mongoose");

const adminSchema = new mongoose.Schema({
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