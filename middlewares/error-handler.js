function errorHandler(err, req, res, next) {
  if (err.statusCode) {
    return res
      .status(err.statusCode)
      .send({
        message: err.message,
      });
  }
  res
    .status(500)
    .send({
      message: 'Ошибка сервера',
    });
  return next(err);
}

module.exports = errorHandler;
