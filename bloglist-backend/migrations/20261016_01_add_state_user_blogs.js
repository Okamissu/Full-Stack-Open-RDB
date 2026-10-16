const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('user_blogs', 'state', {
      type: DataTypes.ENUM('unread', 'read'),
      allowNull: false,
      defaultValue: 'unread',
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('user_blogs', 'state');
  },
};
