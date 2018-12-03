'use strict'

module.exports.getCredentials = header => {
	const [, hash] = header.split(' ')
	const plainText = Buffer.from(hash, 'base64').toString()
	const [email, pass] = plainText.split(':')
	return {email: email, password: pass}

}
