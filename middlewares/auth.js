const jwt = require('jsonwebtoken');

const { NODE_ENV, KEY_FOR_TOKEN } = process.env;
const { AuthError } = require('../errors');

function authUser(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new AuthError('Нет доступа'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? KEY_FOR_TOKEN : 'develop');
  } catch (e) {
    return next(new AuthError('Нет доступа'));
  }
  req.user = payload;
  return next();
}

module.exports = authUser;
