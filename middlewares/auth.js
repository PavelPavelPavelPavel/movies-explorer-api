const jwt = require('jsonwebtoken');

const { AuthError } = require('../errors');

const KEY_FOR_TOKEN = process.env.KEY_FOR_TOKEN || 'production';
function authUser(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new AuthError('Нет доступа'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, KEY_FOR_TOKEN);
  } catch (e) {
    return next(new AuthError('Нет доступа'));
  }
  req.user = payload;
  return next();
}

module.exports = authUser;
