module.exports = function (app) {
  var userInfo = require('../controllers/user_controller')

  app.use(userInfo.checkToken)

  app.route('/user')
    .post(userInfo.createNewUser)

  app.route('/user/checkUsername')
    .get(userInfo.checkExistUsername)

  app.route('/user/login')
    .get(userInfo.login)
}