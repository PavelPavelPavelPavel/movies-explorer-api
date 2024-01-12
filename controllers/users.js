const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  NotFoundError,
  DataError,
  AlreadyExistsError,
  AuthError,
} = require('../errors');
const {
  userAlreadyExists,
  wrongEmailAndPass,
  accessIsClosed,
  userNotFound,
  wrongInputData,
} = require('../utils/constants');
const userModel = require('../models/user');

const KEY_FOR_TOKEN = process.env.KEY_FOR_TOKEN || 'production';
const SALT = 10;
const createToken = (id) => jwt.sign({ _id: id }, KEY_FOR_TOKEN, {
  expiresIn: 3600000 * 24 * 7,
});

function createUser(req, res, next) {
  const { email, password, ...userData } = req.body;
  return bcrypt.hash(password, SALT)
    .then((hash) => userModel
      .create({ email, password: hash, ...userData })
      .then((user) => {
        const {
          name,
        } = user;
        return res
          .status(201)
          .send({
            name, email,
          });
      }))
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return next(new AlreadyExistsError(userAlreadyExists));
      }
      if (err.name === 'ValidationError') {
        return next(new DataError(wrongEmailAndPass));
      }
      return next(err);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  return userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (user) {
        return bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return next(err);
          }
          if (isMatch) {
            return res.send({ token: `Bearer ${createToken(user._id)}`, email });
          }
          return next(new AuthError(accessIsClosed));
        });
      }
      return next(new AuthError(accessIsClosed));
    })
    .catch(next);
}

function getUserInfo(req, res, next) {
  const userId = req.user._id;
  return userModel.findById(userId)
    .then((user) => {
      const {
        name, email,
      } = user;
      if (!user) {
        return next(new NotFoundError(userNotFound));
      }
      return res.send({
        name, email,
      });
    })
    .catch(next);
}

function updateInfo(req, res, next) {
  const userId = req.user._id;
  const { body } = req;
  return userModel
    .findByIdAndUpdate(
      userId,
      {
        $set: {
          ...body,
        },
      },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(userNotFound));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new AlreadyExistsError(userAlreadyExists));
      }
      if (err.name === 'ValidationError') {
        return next(new DataError(wrongInputData));
      }
      return next(err);
    });
}

function updateUserInfo(req, res, next) {
  return updateInfo(req, res, next);
}

module.exports = {
  createUser,
  updateUserInfo,
  login,
  getUserInfo,
};
