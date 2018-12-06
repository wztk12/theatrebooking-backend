'use strict'

const mongoose = require('mongoose')

const showSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    imageUrl: {type: String, required: true},
    date: {type: Date, required: true},
    description: {type: String, required: true}
})

module.exports = mongoose.model('Show', showSchema)
