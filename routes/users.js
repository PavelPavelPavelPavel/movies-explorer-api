const usersRouter = require('express').Router();
const {
  getUserInfo,
  updateUserInfo,
} = require('../controllers/users');
const {
  validateUpdateUserInfo,
} = require('../utils/validation/userValidation');

usersRouter.get('/me', getUserInfo);
usersRouter.patch('/me', validateUpdateUserInfo, updateUserInfo);

module.exports = usersRouter;
