require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');

const { NODE_ENV, PORT, MONGO_URL } = process.env;
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const appRouter = require('./routes');
const errorHandler = require('./middlewares/error-handler');

const serverPort = NODE_ENV === 'production' ? PORT : 3000;
console.log(serverPort);
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/bitfilmsdb')
  .then(() => {
    console.log('DB connected');
  });
const app = express();
app.use(helmet());

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

app.listen(NODE_ENV === 'production' ? PORT : 3000, () => console.log(`server Started at ${PORT || 3000}`));
