'use strict'
const mongoose = require('mongoose')

const lodgeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    name: String,
    description: String,
    price: Number,
    popularity: Number,
    link: String,
    department: {
        type: mongoose.Schema.ObjectId,
        ref: 'department'
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'category'
    },
    image: String
});

module.exports = mongoose.model('lodge', lodgeSchema)