'use strict'

const request = require('supertest')
const server = require('../index.js')
const status = require('http-status-codes')

beforeAll( async() => console.log('Jest starting!'))

// close the server after each test
afterAll(() => {
	server.close()
	console.log('server closed!')
})

describe('/register', () => {

	test('adding a single user', async done => {
		await request(server).post('/register')
			.send({email: 'test@test.com', pwd: 'test'})
			.set('Accept', 'application/json')
			.expect(status.CREATED)
			.expect( res => {
				res.body.status = 'success'
				res.body.message.item.email = 'test@test.com'
				res.body.message.item.pwd = 'test'
      	done()
			})
	})

	test('handling a database error', async done => {
		const response = await request(server).post('/register')
			.send({username: 'test', pwd: 'test'})
			.set('error', 'foo')
			.expect(status.BAD_REQUEST)
		const data = JSON.parse(response.text)
		expect(data.message).toBe('foo')
		done()

	})
})
