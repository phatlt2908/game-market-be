module.exports = function (app) {
  const userInfo = require('../controllers/user_controller')

  app.route('/api/authenticate/login')
    .get(userInfo.login)

  app.route('/api/authenticate/user')
    .post(userInfo.createNewUser)

  app.use('/api', userInfo.checkToken)

  app.route('/api/user/checkUsername')
    .get(userInfo.checkExistUsername)
}