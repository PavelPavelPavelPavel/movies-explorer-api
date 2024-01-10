const { KEY_FOR_TOKEN } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  NotFoundError,
  DataError,
  AlreadyExistsError,
  AuthError,
} = require('../errors');
const userModel = require('../models/user');

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
        // eslint-disable-next-line no-shadow
        const {
          // eslint-disable-next-line no-shadow
          name, email,
        } = user;
        return res
          .status(201)
          .send({
            name, email,
          });
      }))
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return next(new AlreadyExistsError('Пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new DataError('Поля имейл или пароль заполнены неверно'));
      }
      return next(err);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  return userModel.findOne({ email }).select('+password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (user) {
        // eslint-disable-next-line consistent-return
        return bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return next(err);
          }
          if (isMatch) {
            return res.send({ token: createToken(user._id), email });
          }
          return next(new AuthError('Нет доступа'));
        });
      }
      return next(new AuthError('Нет доступа'));
    })
    .catch(next);
}

function getUserInfo(req, res, next) {
  const userId = req.user._id;
  return userModel.findById(userId)
    .then((user) => {
      const {
        _id, name, email,
      } = user;
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send({
        _id, name, email,
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
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new DataError('Введены некорректные данные'));
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
