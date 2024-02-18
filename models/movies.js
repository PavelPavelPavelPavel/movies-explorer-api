const mongoose = require('mongoose');
const { urlRegexp, languageEnRegexp, languageRuRegexp } = require('../utils/regexp');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, 'Поле "country" должно быть заполнено'],
    },
    director: {
      type: String,
      required: [true, 'Поле "director" должно быть заполнено'],
    },
    duration: {
      type: Number,
      required: [true, 'Поле "duration" должно быть заполнено'],
    },
    year: {
      type: String,
      required: [true, 'Поле "year" должно быть заполнено'],
    },
    description: {
      type: String,
      required: [true, 'Поле "description" должно быть заполнено'],
    },
    image: {
      type: String,
      validate: {
        validator(v) {
          return urlRegexp.test(v);
        },
        message: 'Некорректный URL',
      },
      required: [true, 'Поле "image" должно быть заполнено'],
    },
    trailerLink: {
      type: String,
      validate: {
        validator(v) {
          return urlRegexp.test(v);
        },
        message: 'Некорректный URL',
      },
      required: [true, 'Поле "trailerLink" должно быть заполнено'],
    },
    thumbnail: {
      type: String,
      validate: {
        validator(v) {
          return urlRegexp.test(v);
        },
        message: 'Некорректный URL',
      },
      required: [true, 'Поле "thumbnail" должно быть заполнено'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    isLiked: {
      type: Boolean,
    },
    nameRU: {
      type: String,
      validate: {
        validator(v) {
          return languageRuRegexp.test(v);
        },
        message: 'Только кирилица',
      },
      required: [true, 'Поле "nameRU" должно быть заполнено'],
    },
    nameEN: {
      type: String,
      validate: {
        validator(v) {
          return languageEnRegexp.test(v);
        },
        message: 'Только латиница',
      },
      required: [true, 'Поле "nameEn" должно быть заполнено'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('movie', movieSchema);
