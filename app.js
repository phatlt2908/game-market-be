const express = require('express');
const bodyParser = require('body-parser')
const app = express()

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Methods", "*")
  next();
});

require('./app/routers/routes')(app)

app.listen(process.env.PORT || 8081)