
'use strict'

/* eslint-disable no-magic-numbers */

const todo = require('../modules/todo.js')

describe('register', () => {

	test('registering an user', async done => {
		const request = {body: {email: 'test@test.com', password: 'test'}}
		const data = await todo.register(request)
		expect(data.email).toBe('test@test.com')
		expect(data.password).toBe('test')
		done()
	})
})
