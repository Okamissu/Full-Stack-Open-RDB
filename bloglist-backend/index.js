const express = require('express');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');
const { syncModels } = require('./models');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const readingListsRouter = require('./controllers/readingLists');
const loginRouter = require('./controllers/login');
const authorsRouter = require('./controllers/authors');
const resetRouter = require('./controllers/reset');

const unknownEndpoint = require('./middlewares/unknownEndpoint');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/readinglists', readingListsRouter);
app.use('/api/login', loginRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/reset', resetRouter);

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.use(unknownEndpoint);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

if (require.main === module) {
  start();
}

module.exports = app;
