module.exports = {
  RANDOM_AND_PASSWORD_SQL: 'SELECT random_key, password FROM user_info WHERE user_name = ?',
  LOGIN_SQL: 'SELECT user_name, name, is_active, phone, email, create_date, last_login FROM user_info WHERE user_name = ? AND password = ?'
}