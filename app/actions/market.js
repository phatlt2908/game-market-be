const mysqldb = require('../../config/mysql_connect')
const bcrypt = require('bcrypt')
const marketRespository = require('../respository/market_respository')
const jwt = require('jsonwebtoken')
const config = require('../../config/config')

getAllProducts = async function (req, res) {
  let result = await mysqldb(marketRespository.GET_ALL_PRODUCTS)
  
  res.status(200).send({ products: result })
}


module.exports = {
  getAllProducts
}