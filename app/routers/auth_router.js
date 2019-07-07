const app = module.exports = require('express')()

const {login, logout, signup, checkPhone} = require('../actions').auth

app.post('/login', login)

app.post('/signup', signup)

app.post('/logout', logout)

app.post('/check-username', checkUsername)

app.post('/check-phone', checkPhone)