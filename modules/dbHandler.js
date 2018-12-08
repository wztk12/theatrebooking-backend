'use strict'

const mongoose = require('mongoose')
const User = require('../models/User')
const LoginData = require('../models/LoginData')
const Show = require('../models/Show')
const Seat = require('../models/Seat')
mongoose.set('useCreateIndex', true) //needed to add that to avoid using deprecated unique attribute
const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports.connect = mongoUri => mongoose.connect(mongoUri, {useNewUrlParser: true})
	.then(res => {
		const message = 'Database connected'
		console.log(message)
		return res
	})
	.catch(err => {
		throw err
	})

module.exports.addUser = async userData => {
	const encryptedPassword = await bcrypt.hash(userData.password, saltRounds)
	const user = new User({
		_id: new mongoose.Types.ObjectId(),
		email: userData.email,
		password: encryptedPassword
	})
	return user.save()
		.then(res => res)
		.catch( () => {
			throw new Error('user exists')
		})
}

module.exports.checkAuth = async(email, password) => User.findOne({email: email})
	  .then( async res => {
		const validatedPw = await bcrypt.compare(password, res.password)
		if(!validatedPw) throw new Error() //will be catched by the catch clause of promise and handled
	  })
	  .then(async() => {
		  const loginData = new LoginData({
			  email: email
		  })
		  await loginData.save()
		  return loginData
	  })
	  .catch(async() => 'UNAUTHORIZED')

module.exports.getId = async email => User.findOne({email: email})
	.then( res => res._id)
	.catch(err => {
		throw err
	})

module.exports.addShow = async showData => {
	const show = new Show({
		title: showData.title,
		imageUrl: showData.imageUrl,
		date: showData.date,
		description: showData.description
	})
	const seats = new Seat({
		title: showData.title
	})
	return show.save()
		.then(res => {
			seats.save()
			return res
		})
		.catch( () => {
			throw new Error('title exists')
		})
}

module.exports.dumpShows = () => Show.find()

module.exports.findShow = id => Show.findById(id)

module.exports.bookSeat = async (show, seat) => await Seat.updateOne({title: show},{$set: {[seat]: true}})
	.then(res => {
		if(res["nModified"]===0) throw new Error('couldnt update')
	})


