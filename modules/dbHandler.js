'use strict'

const mongoose = require('mongoose')
const User = require('../models/User')

module.exports.addUser = (email, password) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        password: password
    })
    user.save()
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
}
