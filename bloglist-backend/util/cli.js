const { connectToDatabase, sequelize } = require('./db');
const { QueryTypes } = require('sequelize');

const main = async () => {
  try {
    connectToDatabase();
    const blogs = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT,
    });
    console.log(blogs);
    sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the DB:', error);
  }
};

main();
