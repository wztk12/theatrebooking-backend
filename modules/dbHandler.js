'use strict'

const mongoose = require('mongoose')
const User = require('../models/User')
mongoose.set('useCreateIndex', true) //needed to add that to avoid deprecated unique use

module.exports.connect = mongoUri => mongoose.connect(mongoUri, {useNewUrlParser: true})
	.then(res => {
		const message = 'Database connected'
		console.log(message)
		return res
	})
	.catch(err => {
		throw new Error(err)
	})

module.exports.addUser = userData => {
	const user = new User({
		_id: new mongoose.Types.ObjectId(),
		email: userData.email,
		password: userData.password
	})
	return user.save()
		.then(res => res)
		.catch( () => {
			throw new Error('user exists')
		})
}
