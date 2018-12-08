'use strict'

const request = require('supertest')
require('dotenv').config()
const mongoose = require('mongoose')
const {MongoMemoryServer} = require('mongodb-memory-server')
let mongoServer
const db = require('../modules/dbHandler')
const Show = require('../models/Show')
const server = require('../index.js')
const supertest = request(server)
const status = require('http-status-codes')

beforeAll(async done => {
	mongoServer = new MongoMemoryServer()
	const mongoUri = await mongoServer.getConnectionString()
	process.env.mongoUri = mongoUri
	await db.connect(process.env.mongoUri)
	await db.addUser({email: 'test@test.com', password: 'test'})
	await db.addShow({title: 'Big Bad Wolf', imageUrl: 'bigbadwolf.png',
		date: '06-12-2018 18:00', description: 'Something about show Big Bad Wolf'})
	done()
})

// close the server after each test
afterAll(() => {
	mongoose.disconnect()
	mongoServer.stop()
	server.close()
	console.log('server closed!')
})

describe('HEAD /users', () => {

	test('should return 401 if missing Authorization header', async done => {
		await supertest.head('/users').expect(status.UNAUTHORIZED)
		done()
	})

	test('should return OK if valid Authorization header', async done => {
		//const id = await db.getId('test@test.com')
		await supertest.head('/users')
			.auth('test@test.com', 'test')
			.expect(status.OK)
		done()
	})

	test('should return 401 if the username is invalid', async done => {

		await supertest.head('/users')
			.auth('janedoe', 'P455w0rd')
			.expect(status.UNAUTHORIZED)
		done()
	})

})


describe('POST /register', () => {

	test('adding a single user', async done => {
		await request(server).post('/register')
			.send({email: 'another@test.com', password: 'test'})
			.set('Accept', 'application/json')
			.expect(status.CREATED)
			.expect( res => {
				res.body.status = 'success'
				res.body.message.email = 'another@test.com'
				res.body.message.password = 'test'
				done()

			})
	})

	test('adding a duplicate user', async done => {
		await request(server).post('/register')
		  .send({email: 'test@test.com', password: 'test'})
		  .set('Accept', 'application/json')
		  .expect(status.BAD_REQUEST)
		  .expect( res => {
			  res.body.status = 'error'
			  res.body.message = 'user exists'
			  done()
		  })
	})

	test('handling a database error', async done => {
		const response = await request(server).post('/register')
			.send({email: 'test@test.com', password: 'test'})
			.set('error', 'foo')
			.expect(status.BAD_REQUEST)
		const data = JSON.parse(response.text)
		expect(data.message).toBe('foo')
		done()
	})
})

describe('POST /addShow', () => {

	test('adding a proper show', async done => {
		await request(server).post('/addShow')
			.send({title: 'Cindirella', imageUrl: 'cindirella.png',
				date: new Date('18:00 06-12-2018'), description: 'Something about show Cindirella'})
			.set('Accept', 'application/json')
			.expect(status.CREATED)
			.expect( res => {
				res.body.status = 'success'
				res.body.message.title = 'Cindirella'
				done()
			})
	})

	test('adding a duplicate user', async done => {
		await request(server).post('/addShow')
		  .send({title: 'Big Bad Wolf', imageUrl: 'bigbadwolf.png',
		  date: new Date('18:00 06-12-2018'), description: 'Something about show Big Bad Wolf'})
		  .set('Accept', 'application/json')
		  .expect(status.BAD_REQUEST)
		  .expect( res => {
			  res.body.status = 'error'
			  res.body.message = 'title exists'
			  done()
		  })
	})

	test('handling a database error', async done => {
		const response = await request(server).post('/addShow')
			.send({title: 'doesnt', imageUrl: 'matter'})
			.set('error', 'foo')
			.expect(status.BAD_REQUEST)
		const data = JSON.parse(response.text)
		expect(data.message).toBe('foo')
		done()
	})
})

describe('GET /dumpShows', () => {

	test('it dumps the data', async done => {
		await request(server).get('/dumpShows')
			.expect(status.OK)
			.expect(res => {
				res.body.status = 'success'
				expect(res.body.message).toBeInstanceOf(Array)
				done()
			})
	})

	test('it reacts to errors', async done => {
		const response = await request(server).get('/dumpShows')
			.set('error', 'foo')
			.expect(status.BAD_REQUEST)
		const data = JSON.parse(response.text)
		expect(data.message).toBe('foo')
		done()
	})
})

describe('GET /findShow/:id', () => {

	test('proper show', async done => {
		const id = await Show.findOne({title: 'Big Bad Wolf'}).then(res => res._id)
		await request(server).get('/getShow/'+ id)
			.expect(status.OK)
			.expect(res => {
				res.body.status = 'success'
				expect(res.body.message).toBeInstanceOf(Object)
				done()
			})
	})

	test('catching errors', async done => {
		const id = await Show.findOne({title: 'Big Bad Wolf'}).then(res => res._id)
		const response = await request(server).get('/getShow/' + id)
			.set('error', 'foo')
			.expect(status.BAD_REQUEST)
		const data = JSON.parse(response.text)
		expect(data.message).toBe('foo')
		done()
	})
})

describe('PUT /bookSeat/:show/:id', () => {
	
	test('it works with proper details', async done => {
		const showId = await Show.findOne({title: 'Big Bad Wolf'}).then(res => res._id)
		await request(server).put('/bookSeat/' + showId + '/' + 1)
			.expect(status.OK)
			.expect(res => {
				res.body.status = 'success'
				res.body.message.seat = 1
				done()
			})
	})
	test('it doesnt work with non existent details', async done => {
		const showId = new mongoose.Types.ObjectId()
		await request(server).put('/bookSeat/' + showId + '/' + 1)
			.expect(status.BAD_REQUEST)
			.expect(res => {
				res.body.status = 'error'
				done()
			})
	})
})