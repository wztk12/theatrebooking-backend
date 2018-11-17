'use strict'

const users = []

module.exports.register = async request => {
	const userData = await this.extractBodyData(request)
	users.push(userData)
	return userData
}

module.exports.extractBodyData = async request => ({email: request.body.email, password: request.body.password})
