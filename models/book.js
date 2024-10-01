const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    "title": {
        type: String
    },
    "author": {
        type: String
    },
    "ISBN": {
        type: String,
        unique: true
    },
    "isAvailable": {
        type: Boolean,
        default: true
    },
    "reserved": {
        type: Boolean,
        default: false
    },
    "reservedBy": [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    "borrowedBy": { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    "genre": {
        type: String
    },
    "publication_year": {
        type: Number
    },
    "reviews": [
        {
            userId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' 
            },
            rating: { 
                type: Number, 
                min: 1, 
                max: 5 
            },  
            review: { 
                type: String 
            },
            createdAt: { 
                type: Date, 
                default: Date.now 
            }
        }
    ]
});

module.exports = mongoose.model('Book', BookSchema, 'books');
