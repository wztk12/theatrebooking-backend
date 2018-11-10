'use strict'

const users = []
//const mongoose = require('mongoose')
//const uri = 'mongodb+srv://zatonskw:tO3tPa2yBALIiNhm@theatrebookingwz-hhqjx.mongodb.net/test?retryWrites=true'


module.exports.register = async request => {
	const userData = await this.extractBodyData(request)
	users.push(userData)
	return userData
}

module.exports.extractBodyData = async request => ({email: request.body.email, pwd: request.body.pwd})
