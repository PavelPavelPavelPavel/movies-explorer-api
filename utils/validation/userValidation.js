const { celebrate, Joi } = require('celebrate');

const validateCreateUser = celebrate({
  body: Joi.object().required().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
    password: Joi.string(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().required().keys({
    email: Joi.string().email(),
    password: Joi.string(),
  }),
});

const validateUpdateUserInfo = celebrate({
  body: Joi.object().required().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
});

const validateIdUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUpdateUserInfo,
  validateIdUser,
};
