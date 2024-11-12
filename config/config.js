const pg = require('pg')
require("dotenv").config({ path: `${process.cwd()}/.env` });

module.exports = {
  development: {
    username: process.env.DB_DEV_USERNAME,
    password: process.env.DB_DEV_PASSWORD,
    database: process.env.DB_DEV_DATABASE,
    host: process.env.DB_DEV_HOST,
    port: process.env.DB_DEV_PORT,
    dialect: "postgres",
    timezone: "+07:00",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: "postgres",
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // only use this for development
      },
    },
    timezone: "+07:00",
  },
};
