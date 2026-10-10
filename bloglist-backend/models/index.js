const Blog = require('./blog');
const User = require('./user');

User.hasMany(Blog, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});

Blog.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});

const syncModels = async () => {
  await User.sync();
  await Blog.sync();
};

module.exports = {
  Blog,
  User,
  syncModels,
};
