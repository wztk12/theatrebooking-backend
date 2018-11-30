'use strict'

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    email: {type: String, required: true},
    password: {type: String, required: true}
})

module.exports = mongoose.model('User', userSchema)