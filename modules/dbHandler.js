'use strict'

const mongoose = require('mongoose')
const User = require('../models/User')
const LoginData = require('../models/LoginData')
mongoose.set('useCreateIndex', true) //needed to add that to avoid using deprecated unique attribute 
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

module.exports.checkAuth = async(email, password) => {
	return User.findOne({email: email})
	  .then( async res => {
		const validatedPw = await bcrypt.compare(password, res.password)
		if(!validatedPw) throw new Error()
	  })
	  .then(async () => {
		  const loginData = new LoginData({
			  email: email
		  })
		  await loginData.save()
		  return loginData
	  })
	  .catch(async () => {
		  return 'UNAUTHORIZED'
	  })
}
