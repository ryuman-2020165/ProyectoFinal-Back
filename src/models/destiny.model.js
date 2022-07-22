'use strict'
const mongoose = require('mongoose')

const destinySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    trip: {
        type: mongoose.Schema.ObjectId,
        ref: 'trip'
    },
    lodge: {
        type: mongoose.Schema.ObjectId,
        ref: 'lodge'
    },
    startDate: Date,
    endDate: Date
});

module.exports = mongoose.model('destiny', destinySchema)