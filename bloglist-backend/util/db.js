const Sequelize = require('sequelize');
const { DATABASE_URL, TEST_DATABASE_URL, NODE_ENV } = require('./config');

const { Umzug, SequelizeStorage } = require('umzug');

const databaseUrl =
  NODE_ENV === 'test' || process.env.TESTING === 'true'
    ? TEST_DATABASE_URL
    : DATABASE_URL;

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
});

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  });

  const migrations = await migrator.up();
  console.log('Migrations up to date', {
    files: migrations.map((m) => m.name),
  });
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('Connected to the database');
  } catch (err) {
    console.log('Failed to connect to the database');
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize };
