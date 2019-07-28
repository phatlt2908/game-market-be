const app = module.exports = require('express')()

const {getAllProducts} = require('../actions').market
const {checkToken} = require('../actions').auth

app.use(checkToken)

app.get('/get-all-products', getAllProducts)