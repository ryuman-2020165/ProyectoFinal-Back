'use strict'
const mongoose = require('mongoose')

const departmentSchema = mongoose.Schema({
    name: String,
    description: String
});

module.exports = mongoose.model('department', departmentSchema)