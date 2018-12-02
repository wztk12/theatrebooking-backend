'use strict'

const request = require('supertest')
require('dotenv').config()
const mongoose = require('mongoose')
const {MongoMemoryServer} = require('mongodb-memory-server')
let mongoServer
const db = require('../modules/dbHandler')
const server = require('../index.js')
const status = require('http-status-codes')

beforeAll(async() => {
	mongoServer = new MongoMemoryServer()
	const mongoUri = await mongoServer.getConnectionString()
	process.env.mongoUri = mongoUri
	db.connect(process.env.mongoUri)
})

// close the server after each test
afterAll(() => {
	mongoose.disconnect()
	mongoServer.stop()
	server.close()
	console.log('server closed!')
})

describe('/register', () => {

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
		  .send({email: 'another@test.com', password: 'test'})
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
			.send({email: 'test', password: 'test'})
			.set('error', 'foo')
			.expect(status.BAD_REQUEST)
		const data = JSON.parse(response.text)
		expect(data.message).toBe('foo')
		done()

	})
})
