#!/usr/bin/env node

'use strict'

const Koa = require('koa')
require('dotenv').config()
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
app.use(bodyParser())
const router = new Router()

const status = require('http-status-codes')

const db = require('./modules/dbHandler')
db.connect(process.env.mongoUri) //connect gets intercepted by my test suite
const todo = require('./modules/todo')
const cors = require('@koa/cors')
app.use(cors())

const port = 3000


app.use(async (ctx, next) => {
	ctx.set('Access-Control-Allow-Origin', '*')
	ctx.set('content-type', 'application/json')
	await next()
})

router.head('/users', async ctx => {
	ctx.set('Access-Control-Allow-Credentials', 'true')
	try {
		const creds = ctx.get('Authorization')
		if (ctx.get('Authorization').length === 0) throw new Error('missing Authorization')
		const credentials = await todo.getCredentials(creds)
		const valid = await db.checkAuth(credentials.email, credentials.password)
		if (valid === 'UNAUTHORIZED') throw new Error('invalid Authorization')
		ctx.status = status.OK
		ctx.body = { status: 'ok', message: 'login successful' }
	} catch (err) {
		ctx.status = status.UNAUTHORIZED
		ctx.body = { status: 'error', message: err.message }
	}
})


router.post('/register', async ctx => {
	ctx.set('Allow', 'GET, POST')
	try {
		if (ctx.get('error')) throw new Error(ctx.get('error'))
		const userData = {
			email: ctx.request.body.email,
			password: ctx.request.body.password
		}
		await db.addUser(userData)
			.then(res => {
				ctx.status = status.CREATED
				ctx.body = { status: 'success', message: res }
			})
			.catch(err => {
				ctx.status = status.BAD_REQUEST
				ctx.body = { status: 'error', message: err.message }
			})
	} catch (err) {
		ctx.status = status.BAD_REQUEST
		ctx.body = { status: 'error', message: err.message }
	}
})

router.post('/addShow', async ctx => {
	ctx.set('Allow', 'GET, POST')
	try {
		if (ctx.get('error')) throw new Error(ctx.get('error'))
		const show = {
			title: ctx.request.body.title,
			imageUrl: ctx.request.body.imageUrl,
			date: ctx.request.body.date,
			description: ctx.request.body.description
		}
		await db.addShow(show)
			.then(res => {
				ctx.status = status.CREATED
				ctx.body = { status: 'success', message: res }
			})
			.catch(err => {
				ctx.status = status.BAD_REQUEST
				ctx.body = { status: 'error', message: err.message }
			})
	} catch (err) {
		ctx.status = status.BAD_REQUEST
		ctx.body = { status: 'error', message: err.message }
	}
})

app.use(router.routes())
app.use(router.allowedMethods())
const server = app.listen(port, () => {
	console.log('app is listening on ' + port)
})

module.exports = server
