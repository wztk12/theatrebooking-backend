'use strict'

const mongoose = require('mongoose')

const loginSchema = new mongoose.Schema({
	date: {type: Date, default: new Date()},
	email: {type: String}
})

module.exports = mongoose.model('LoginData', loginSchema)
