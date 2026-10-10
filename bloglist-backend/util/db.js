const Sequelize = require('sequelize');
const { DATABASE_URL, TEST_DATABASE_URL, NODE_ENV } = require('./config');

const databaseUrl = NODE_ENV === 'test' ? TEST_DATABASE_URL : DATABASE_URL;

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');
  } catch (err) {
    console.log('Failed to connect to the database');
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize };
