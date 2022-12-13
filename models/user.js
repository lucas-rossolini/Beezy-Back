const model = require('./model');

module.exports = model('user', [
  'first_name',
  'last_name',
  'email',
  'password',
  'token',
]);
