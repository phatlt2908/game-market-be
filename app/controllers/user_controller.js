const UserInfo = require('../models/user_model')

exports.createNewUser = function (req, res) {
  let newUser = new UserInfo(req.body)
  // check required
  if (!newUser.user_name || !newUser.password) {
    res.status(400).send({ error: '0002', message: 'Please provide username/password' })
  }
  else {
    UserInfo.createNewUser(newUser, function (err, userId) {
      if (err) {
        res.status(400).send(err)
      }
      else {
        console.log('id: ', userId)
        res.status(200).send(userId.toString())
      }
    })
  }
}

exports.checkExistUsername = function (req, res) {
  let username = req.body.user_name
  console.log('username', username)

  UserInfo.checkExistUsername(username, function (err, count) {
    if (err) {
      res.send(err)
    }
    else {
      res.send(count)
    }
  })
}

exports.login = function (userInfo, res) {
  UserInfo.login(userInfo.body, function (err, response) {
    if (err) {
      if (err == '0004') {
        res.status(400).send({ error: '0004', message: 'Password is incorrect' })
      }
      if (err == '0005') {
        res.status(400).send({ error: '0005', message: 'User is not exist' })
      }
      if (err == '0006') {
        res.status(400).send({ error: '0006', message: 'Account have not activated yet' })
      }
      else {
        res.status(400)
      }
    }
    else {
      console.log('>> res', response)
      res.send(response)
    }
  })
}

exports.checkToken = function (req, res, next) {
  let token = req.headers['x-access-token'] || req.headers['authorization']
  UserInfo.checkToken(token, function (err, response) {
    if (err) {
      if (err == '0007') {
        res.status(400).send({ error: '0007', message: 'Token is not valid' })
      }
      if (err == '0008') {
        res.status(400).send({ error: '0008', message: 'Auth token is not supplied' })
      }
    }
    else {
      next()
    }
  })
}