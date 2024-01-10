/* eslint-disable no-shadow */
const jwt = require('jsonwebtoken');

const { KEY_FOR_TOKEN } = process.env;
const userModel = require('../models/user');
const { AuthError } = require('../errors');

function authUser(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return next(new AuthError('Нет доступа'));
  }
  return jwt.verify(token, KEY_FOR_TOKEN, (err, decoded) => userModel.findById(decoded._id)
    .then((user) => {
      if (!user) {
        return next(new AuthError('Нет доступа'));
      }
      req.user = { _id: user._id };
      return next();
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        return next(new AuthError('Нет доступа'));
      }
      return next(err);
    }));
}

module.exports = authUser;
