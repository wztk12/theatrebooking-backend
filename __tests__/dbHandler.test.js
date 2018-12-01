'use strict'

const mongoose = require('mongoose')
const {MongoMemoryServer} = require('mongodb-memory-server')
const db = require('../modules/dbHandler')
const User = require('../models/User')
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
		await User.count({email: 'test@test.com'})
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
