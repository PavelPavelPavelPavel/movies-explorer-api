require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const appRouter = require('./routes');
const errorHandler = require('./middlewares/error-handler');

const { PORT, MONGO_URL } = process.env;
mongoose.connect(MONGO_URL).then(() => {
  // eslint-disable-next-line no-console
  console.log('DB connected');
});
const app = express();
const { checkServer } = require('./utils/responseCheck');

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
];
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors(allowedCors));
app.use(requestLogger);
app.use('/', appRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  checkServer(PORT);
});
