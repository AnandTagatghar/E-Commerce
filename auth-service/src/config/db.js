const { Sequelize } = require("sequelize");
const { database_name } = require("../constants");

const sequelize = new Sequelize(
  database_name,
  process.env.DATABASE_USER_NAME,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DATABASE_HOST,
  }
);

module.exports = sequelize;
