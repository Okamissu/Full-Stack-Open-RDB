const Blog = require('./blog');
const User = require('./user');
const UserBlogs = require('./userBlogs');

User.hasMany(Blog, {});
Blog.belongsTo(User, {});

User.belongsToMany(Blog, { through: UserBlogs, as: 'readingBlogs' });
Blog.belongsToMany(User, { through: UserBlogs, as: 'usersReading' });

module.exports = {
  Blog,
  User,
  UserBlogs,
};
