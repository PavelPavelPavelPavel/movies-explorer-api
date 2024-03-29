const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const authUser = require('../middlewares/auth');
const { NotFoundError } = require('../errors');
const {
  validateCreateUser,
  validateLogin,
} = require('../utils/validation/userValidation');
const {
  createUser,
  login,
} = require('../controllers/users');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);
router.use(authUser);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
