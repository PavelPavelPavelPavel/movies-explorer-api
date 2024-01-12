const moviesRouter = require('express').Router();
const {
  getUserMovies,
  createMovie,
  deleteMovie,
  // like,
  // dislike,
} = require('../controllers/movies');
const { validateCreateMovie, validateIdMovie } = require('../utils/validation/movieValidation');

moviesRouter.get('/', getUserMovies);
moviesRouter.post('/', validateCreateMovie, createMovie);
moviesRouter.delete('/:movieId', validateIdMovie, deleteMovie);
// moviesRouter.put('/:_id/likes', validateIdMovie, like);
// moviesRouter.delete('/:_id/likes', validateIdMovie, dislike);

module.exports = moviesRouter;
