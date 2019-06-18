const mysqldb = require('../../config/mysql_connect')
const bcrypt = require('bcrypt');
const userRespository = require('../respositorys/user_respository')
const jwt = require('jsonwebtoken')
const config = require('../../config/config')

let UserInfo = function (userInfo) {
  this.user_name = userInfo.user_name
  this.password = userInfo.password
  this.name = userInfo.name
  this.is_active = userInfo.is_active
  this.phone = userInfo.phone
  this.email = userInfo.email
  this.create_date = userInfo.create_date
  this.last_login = userInfo.last_login
  this.random_key = userInfo.random_key
}

UserInfo.createNewUser = function createNewUser(newUser, result) {
  this.checkExistUsername(newUser.user_name, function (err, res) {
    if (err) {
      result(err, null)
    }
    else {
      if (res[0].count > 0) {
        result({ error: '0001', message: 'Username is existed' }, null)
      }
      else {
        newUser.random_key = Math.random().toString(36).substring(2, 7);
        // Has password before regist
        console.log('random: ', newUser.password + newUser.random_key)
        bcrypt.hash(newUser.password + newUser.random_key, 10, function (err, hash) {
          if (err) {
            result(err, null)
          }
          newUser.password = hash

          mysqldb.query("INSERT INTO user_info set ?", newUser, function (err, res) {
            if (err) {
              result(err, null)
            }
            else {
              result(null, res.insertId)
            }
          })
        })
      }
    }
  })
}

UserInfo.checkExistUsername = function checkExistUsername(username, result) {
  let sql = 'SELECT Count(user_name) as count FROM user_info WHERE user_name = ?'
  mysqldb.query(sql, username, function (err, res) {

    if (err) {
      console.log("error: ", err)
      result(err, null)
    }
    else {
      console.log(res)
      result(null, res)
    }
  })
}

UserInfo.login = function login(userInfo, result) {
  let username = userInfo.user_name
  let password = userInfo.password

  // Get Password hash
  mysqldb.query(userRespository.RANDOM_AND_PASSWORD_SQL, username, function (err, res) {
    if (res.length) {
      let ranAndPass = res[0]
      // Compare password
      bcrypt.compare(password + ranAndPass.random_key, ranAndPass.password, function (err, res) {
        if (res) {
          // Get User info
          mysqldb.query(userRespository.LOGIN_SQL, [username, ranAndPass.password], function (err, res) {
            if (err) {
              result(err, null)
            }
            else {
              if (res[0].is_active) {
                let token = jwt.sign (
                  {username: username},
                  config.secret,
                  {expiresIn: '24h'}
                )
                result(null, {res, token})
              }
              else {
                // Account have not activated yet
                result('0006', null)
              }
            }
          })
        } else {
          // Password is incorrect
          result('0004', null)
        }
      })
    }
    else {
      // User is not exist
      result('0005', null)
    }
  })
}

UserInfo.checkToken = function checkToken(token, res) {
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length)
  }
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        result('0007', null)
      } else {
        // req.decoded = decoded
        result(null, res)
      }
    })
  } else {
    result('0008', null)
  }
}

// Common function


module.exports = UserInfo