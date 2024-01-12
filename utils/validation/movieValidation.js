const { celebrate, Joi } = require('celebrate');
const { urlRegexp } = require('../regexp');

const validateCreateMovie = celebrate({
  body: Joi.object().required().keys({
    country: Joi.string(),
    director: Joi.string(),
    duration: Joi.number(),
    year: Joi.string(),
    description: Joi.string(),
    image: Joi.string().pattern(urlRegexp),
    trailerLink: Joi.string().pattern(urlRegexp),
    thumbnail: Joi.string().pattern(urlRegexp),
    nameRU: Joi.string(),
    nameEN: Joi.string(),
    movieId: Joi.string().length(24).hex().required(),
  }),
});

const validateIdMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required(),
  }),
});

module.exports = {
  validateCreateMovie,
  validateIdMovie,
};
