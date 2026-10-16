const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class UserBlogs extends Model {}

UserBlogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'blogs', key: 'id' },
    },
    state: {
      type: DataTypes.ENUM('unread', 'read'),
      allowNull: false,
      defaultValue: 'unread',
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'userBlogs',
  },
);

module.exports = UserBlogs;
