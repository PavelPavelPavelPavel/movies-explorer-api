require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const appRouter = require('./routes');
const errorHandler = require('./middlewares/error-handler');
const mongoUrl = require('./utils/mongoUrl');

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || mongoUrl;
console.log(process.env.PORT);
// const PORT = 3000;
// const { MONGO_URL } = process.env;
mongoose.connect(MONGO_URL).then(() => {
  console.log('DB connected');
});
const app = express();
app.use(helmet());
const { checkServer } = require('./utils/responseCheck');

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
];
app.use(express.json());

app.use(cors(allowedCors));
app.use(requestLogger);
app.use('/', appRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  checkServer(PORT);
});
