module.exports = function (app) {
  app.route('/')
    .get((req, res) => {
      res.send({ msg: 'Welcome to Cho Game' })
    })

  app.use('/auth', require('./auth_router'))
  app.use('/market', require('./market_router'))

  app.all('*', (req, res) => {
    res.status(404).send({ msg: 'not found' })
  })
}