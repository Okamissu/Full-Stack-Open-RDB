const Sequelize = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')

const { DATABASE_URL, TEST_DATABASE_URL, NODE_ENV } = require('./config')

const databaseUrl =
  NODE_ENV === 'test' || process.env.TESTING === 'true'
    ? TEST_DATABASE_URL
    : DATABASE_URL

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
})

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: { glob: 'migrations/*.js' },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    logger: console,
  })

  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('Connected to the database')
  } catch (err) {
    console.log('Failed to connect to the database')
    console.log(err)
    return process.exit(1)
  }
}

module.exports = { connectToDatabase, sequelize }
