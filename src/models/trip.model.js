'use strict'
const mongoose = require('mongoose')

const tripSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    name: String,
    endDate: Date
});

module.exports = mongoose.model('trip', tripSchema)