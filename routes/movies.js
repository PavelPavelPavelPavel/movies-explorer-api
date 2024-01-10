const moviesRouter = require('express').Router();
const {
  getAllMovies,
  createMovie,
  deleteMovie,
  // like,
  // dislike,
} = require('../controllers/movies');
const { validateCreateMovie } = require('../utils/validation/movieValidation');

moviesRouter.get('/', getAllMovies);
moviesRouter.post('/', validateCreateMovie, createMovie);
moviesRouter.delete('/:movieId', deleteMovie);
// moviesRouter.put('/:_id/likes', validateIdMovie, like);
// moviesRouter.delete('/:_id/likes', validateIdMovie, dislike);

module.exports = moviesRouter;
