'use strict'

const mongoose = require('mongoose')
const {MongoMemoryServer} = require('mongodb-memory-server')
const db = require('../modules/dbHandler')
const User = require('../models/User')
const LoginData = require('../models/LoginData')
let mongoServer


beforeAll(async() => {
	mongoServer = new MongoMemoryServer()
	const mongoUri = await mongoServer.getConnectionString()
	await db.connect(mongoUri)
})

afterAll(() => {
	mongoose.disconnect()
	mongoServer.stop()
})

describe('connect', () => {

	test('normal connection', async done => {
		const mongoUri = await mongoServer.getConnectionString()
		db.connect(mongoUri)
			.then( res => {
				expect(res).toBeInstanceOf(mongoose.Mongoose)
				done()
			})
	})

	test('bad authentication connection', async done => {
		/*eslint-disable*/
    const mongoUri = 'mongodb://wrongusername:wrongpassword@theatrebookingwz-shard-00-00-hhqjx.mongodb.net:27017,theatrebookingwz-shard-00-01-hhqjx.mongodb.net:27017,theatrebookingwz-shard-00-02-hhqjx.mongodb.net:27017/test?ssl=true&replicaSet=TheatreBookingWZ-shard-0&authSource=admin&retryWrites=true'
    	/*eslint-enable*/
		db.connect(mongoUri)
			.catch(err => {
				expect(err).toBeInstanceOf(Error)
				done()
			})
	})
})
describe('addUser', () => {

	test('adding an user', async done => {
		const userData = {
			email: 'test@test.com',
			password: 'test'
		}
		await db.addUser(userData)
		await User.countDocuments({email: 'test@test.com'})
			.then(res => {
				expect(res).toBe(1)
			})
		done()
	})

	test('adding a duplicate user,', async done => {
		const userData = {
			email: 'duplicate@user.com',
			password: 'test'
		}
		await db.addUser(userData)
		await db.addUser(userData)
			.catch(err => {
				expect(err.message).toBe('user exists')
				done()
			})
	})
})

describe('checkAuth', () => {

	test('valid username and password saves logindata', async done => {
		const userData = {
			email: 'validation@test.com',
			password: 'validation'
		}
		await db.addUser(userData)
		await db.checkAuth(userData.email, userData.password)
		await LoginData.countDocuments({email: userData.email})
			.then(res => {
				expect(res).toBe(1)
			})
		done()
	})

	test('invalid username returns UNAUTHORIZED', async done => {
		const userData = {
			email: 'authorized@test.com',
			password: 'authorized'
		}
		await db.addUser(userData)
		const data = await db.checkAuth('unauthorized@test.com', userData.password)
		expect(data).toBe('UNAUTHORIZED')
		done()
	})

	test('invalid password returns UNAUTHORIZED', async done => {
		const userData = {
			email: 'authorized2@test.com',
			password: 'authorized'
		}
		await db.addUser(userData)
		const data = await db.checkAuth(userData.email, 'unauthorized')
		expect(data).toBe('UNAUTHORIZED')
		done()
	})
})

describe('getId', () => {
	test('finding id of proper email', async done => {
		await db.getId('test@test.com')
		done()
	})

	test('finding id of non existent email', async done => {
		await db.getId('non@existent.com')
		  .catch(err => {
			  expect(err).toBeInstanceOf(Error)
			  done()
		  })
	})
})
