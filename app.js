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

//define a route, usually this would be a bunch of routes imported from another file
app.get('/', function (req, res, next) {
  res.send('Con chim non')
});

require('./app/routers/user_router')(app)

app.listen(process.env.PORT || 8081)