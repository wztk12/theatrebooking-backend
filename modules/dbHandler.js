'use strict'

const mongoose = require('mongoose')
const User = require('../models/User')
mongoose.set('useCreateIndex', true) //needed to add that to avoid deprecated unique use
const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports.connect = mongoUri => {
	return mongoose.connect(mongoUri, {useNewUrlParser: true})
	.then(res => {
		const message = "Database connected"
		console.log(message)
		return res
	})
	.catch(err => {
		throw new Error(err)
	})
}

module.exports.addUser = async userData => {
	let encryptedPassword = await bcrypt.hash(userData.password, saltRounds)
	const user = new User({
		_id: new mongoose.Types.ObjectId(),
		email: userData.email,
		password: encryptedPassword
	})
	return user.save()
		.then(res => {
			return res
		})
		.catch( () => {
		throw new Error('user exists')
	})
}
