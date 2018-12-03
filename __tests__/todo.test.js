'use strict'

const todo = require('../modules/todo')

describe('getCredentials', () => {

	test('properly reads the credentials', async done => {
		const hash = Buffer.from('test@test.com:password').toString('base64')
		const header = `Basic ${hash}`
		const data = await todo.getCredentials(header)
		expect(data).toEqual({email: 'test@test.com', password: 'password'})
		done()

	})
})
