const mysql = require('mysql')
const util = require('util')

// let conn = mysql.createConnection({
//   database: 'cho_game',
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   port: 3306
// });

let conn = mysql.createConnection({
  database: 'vaynh327_chogame',
  host: 'vaynhanh.org',
  user: 'vaynh327_phat',
  password: 'let1enphat',
  port: 3306
})

const query = util.promisify(conn.query).bind(conn)

// conn.connect(function (err) {
//   if (err) throw err
//   else console.log('Connected!')
// });

module.exports = query