const express = require('express');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');
const { syncModels } = require('./models');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');

const unknownEndpoint = require('./middlewares/unknownEndpoint');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  await syncModels();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

module.exports = app;
