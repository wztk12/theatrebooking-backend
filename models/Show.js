'use strict'

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const showSchema = new mongoose.Schema({
	title: {type: String, required: true, unique: true},
	imageUrl: {type: String, required: true},
	date: {type: Date, required: true},
	description: {type: String, required: true}
})

showSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Show', showSchema)
