const movieModel = require('../models/movies');
const {
  NotFoundError,
  ForbidenError,
  DataError,
} = require('../errors');
const {
  accessIsClosed,
  movieNotFound,
} = require('../utils/constants');

function getUserMovies(req, res, next) {
  const owner = req.user._id;
  return movieModel
    .find({ owner }).sort({ _id: -1 })
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
}

function createMovie(req, res, next) {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameEN, nameRU, thumbnail, movieId,
  } = req.body;
  const userId = req.user._id;
  return movieModel
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      owner: userId,
      movieId,
    })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError(err.message));
      }
      next(err);
    });
}

function deleteMovie(req, res, next) {
  const userId = req.user._id;
  const { id } = req.params;
  return movieModel.findById(id)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError(movieNotFound));
      }
      if (movie.owner.toString() === userId.toString()) {
        return movie
          .deleteOne({ id })
          .then(() => {
            res.send({ id });
          });
      }
      return next(new ForbidenError(accessIsClosed));
    })
    .catch((err) => next(err));
}

// function handlerLikes(req, res, next, findOption) {
//   return movieModel
//     .findByIdAndUpdate(
//       req.params.movieId,
//       findOption,
//       { new: true },
//     )
//     .then((movie) => {
//       if (movie) {
//         return res.status(200).send(movie);
//       }
//       return next(new NotFoundError(movieNotFound));
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         return next(new NotFoundError(movieNotFound));
//       }
//       return next(err);
//     });
// }

// function like(req, res, next) {
//   handlerLikes(req, res, next, {
//     $addToSet: {
//       likes: req.user._id,
//     },
//   });
// }

// function dislike(req, res, next) {
//   handlerLikes(req, res, next, {
//     $pull: {
//       likes: req.user._id,
//     },
//   });
// }

module.exports = {
  getUserMovies,
  createMovie,
  deleteMovie,
  // like,
  // dislike,
};
