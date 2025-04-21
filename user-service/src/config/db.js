const { Sequelize } = require("sequelize");
const { database_name } = require("../constants");

const sequelize = new Sequelize(
  database_name,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
  }
);

module.exports = sequelize;
