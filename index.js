#!/usr/bin/env node

'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
app.use(bodyParser())
const router = new Router()

const status = require('http-status-codes')

const todo = require('./modules/todo.js')

const port = 8080

app.use( async(ctx, next) => {
	ctx.set('Access-Control-Allow-Origin', '*')
	ctx.set('content-type', 'application/json')
	await next()
})

router.post('/register', async ctx => {
	ctx.set('Allow', 'GET, POST')
	try {
		if(ctx.get('error')) throw new Error(ctx.get('error'))
		const item = await todo.register(ctx.request)
		ctx.status = status.CREATED
		ctx.body = {status: 'success', message: {item: item}}
	} catch(err) {
		ctx.status = status.BAD_REQUEST
		ctx.body = {status: 'error', message: err.message}
	}
})

app.use(router.routes())
app.use(router.allowedMethods())
const server = app.listen(port)

module.exports = server
