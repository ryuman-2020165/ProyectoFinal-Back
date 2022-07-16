'use strict'
const mongoose = require('mongoose')

const lodgeSchema = mongoose.Schema({
    
    name: String,
    description: String,
    price: Number,
    popularity: Number,
    department: {
        type: mongoose.Schema.ObjectId,
        ref: 'department'
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'category'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    image: String
});

module.exports = mongoose.model('lodge', lodgeSchema)