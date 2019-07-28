const mysqldb = require('../../config/mysql_connect')
const bcrypt = require('bcrypt')
const userRespository = require('../respository/user_respository')
const jwt = require('jsonwebtoken')
const config = require('../../config/config')

login = async function (req, res) {
  let loginInfo = req.body
  // check required
  if (!loginInfo.username || !loginInfo.password) {
    return res.status(400).send({ error: '0001', message: 'Incomplete information' })
  }
  let ranAndPass = await mysqldb(userRespository.RANDOM_AND_PASSWORD_SQL, loginInfo.username)
  if (!ranAndPass.length) {
    return res.status(400).send({ appcode: '0001', msg: 'user does not exist' })
  }
  ranAndPass = ranAndPass[0]
  // Compare password
  let isMatched = await bcrypt.compare(loginInfo.password + ranAndPass.random_key, ranAndPass.password)
  if (!isMatched) {
    return res.status(400).send({ appcode: '0001', msg: 'Password is incorrect' })
  }
  let result = await mysqldb(userRespository.LOGIN_SQL, [loginInfo.username, ranAndPass.password])
  if (!result) {
    return res.status(400).send({ appcode: '0001', msg: 'Login failed', err })
  }
  if (result[0].is_active) {
    let token = jwt.sign(
      { username: loginInfo.username },
      config.secret,
      { expiresIn: '24h' }
    )
    
    let user = {
      'username': loginInfo.username,
      'name': result[0].name,
      'phone': result[0].phone,
      'email': result[0].email
    }

    res.status(200).send({
      "user": user,
      "accessToken": token
    })
  } else {
    // Account have not activated yet
    return res.status(400).send({ appcode: '0001', msg: 'Account have not activated yet' })
  }
}

signup = async function (req, res) {
  let info = req.body
  // check required
  if (!info.username.trim() || !info.password.trim() || !info.name.trim() || !info.phone.trim()) {
    return res.status(400).send({ error: '0001', message: 'Incomplete information' })
  }

  isExist = await checkExistUsername(info.username)
  if (isExist) {
    return res.status(400).send({ error: '0001', message: 'Username is existed' })
  }
  let randomKey = Math.random().toString(36).substring(2, 7)

  // Has password before regist
  let password = await bcrypt.hash(info.password + randomKey, 10)

  let user = {
    'user_name': info.username,
    'password': password,
    'name': info.name,
    'is_active': false,
    'create_date': new Date(),
    'phone': info.phone,
    'email': info.email,
    'last_login': new Date(),
    'random_key': randomKey
  }

  // Regist User
  let result = await mysqldb("INSERT INTO user_info set ?", user)

  if (result.insertId) {
    res.status(200).send({ message: "Success" })
  }
}

checkToken = function (req, res, next) {
  if (!req.headers['x-access-token'] && !req.headers['authorization']) {
    return res.status(401).send({
      success: false,
      message: 'Missing token'
    })
  }
  let token = req.headers['x-access-token'] || req.headers['authorization']
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length)
  }
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: 'Token is not valid'
        })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    res.status(401).send({
      err: "0001",
      message: "Auth token is not supplied"
    })
  }
}

logout = function (req, res) {
  res.send('abc')
}

checkUsername = async function (req, res) {
  let isExist = await checkExistUsername(req.body.username)
  res.status(200).send({ "isExist": isExist })
}

checkPhone = async function (req, res) {
  let isExist = await checkExistUsername(req.body.phone)
  res.status(200).send({ "isExist": isExist })
}

checkExistUsername = async function (username) {
  let result = await mysqldb(userRespository.CHECK_USERNAME, username)
  if (result[0].count) {
    return true
  } else {
    return false
  }
}

checkExistPhone = async function (phone) {
  let result = await mysqldb(userRespository.CHECK_PHONE, phone)
  if (result[0].count) {
    return true
  } else {
    return false
  }
}

module.exports = {
  login,
  logout,
  signup,
  checkUsername,
  checkPhone,
  checkToken
}