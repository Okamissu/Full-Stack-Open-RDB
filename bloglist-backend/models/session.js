const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class Session extends Model {}

Session.init(
  {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'session',
  },
);

module.exports = Session;
