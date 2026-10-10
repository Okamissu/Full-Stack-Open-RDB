const Blog = require('./blog');
const User = require('./user');

const syncModels = async () => {
  await User.sync({ alter: true });
  await Blog.sync({ alter: true });
};

module.exports = {
  Blog,
  User,
  syncModels,
};
