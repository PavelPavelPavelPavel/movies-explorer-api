/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const movieModel = require('../models/movies');
const {
  NotFoundError,
  ForbidenError,
} = require('../errors');

function getAllMovies(req, res, next) {
  return movieModel
    .find({}).sort({ _id: -1 }).limit(12)
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
}

function createMovie(req, res, next) {
  const movieData = req.body;
  const userId = req.user._id;

  return movieModel
    .create({
      country: movieData.country,
      director: movieData.director,
      duration: movieData.duration,
      year: movieData.year,
      description: movieData.description,
      image: movieData.image,
      trailerLink: movieData.trailerLink,
      nameRU: movieData.nameRU,
      nameEN: movieData.nameEN,
      thumbnail: movieData.thumbnail,
      owner: userId,
      movieId: movieData.movieId,
    })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      next(err);
    });
}

function deleteMovie(req, res, next) {
  const userId = req.user._id;
  const { movieId } = req.params;
  return movieModel.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Фильм не найден'));
      }
      if (movie.owner.toString() === userId.toString()) {
        return movie
          .deleteOne({ id: movieId })
          // eslint-disable-next-line consistent-return
          .then(() => {
            res.send(movieId);
          });
      }
      return next(new ForbidenError('Нет доступа'));
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
//       return next(new NotFoundError('Карточка не найдена'));
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         return next(new NotFoundError('Карточка не найдена'));
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
  getAllMovies,
  createMovie,
  deleteMovie,
  // like,
  // dislike,
};
