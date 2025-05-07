const { Sequelize } = require("sequelize");
const {
  database_name,
  database_retries,
  database_delay,
} = require("../constants");
const logger = require("./logger");

const sequelize = new Sequelize(
  database_name,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    port: process.env.MYSQL_PORT,
  }
);

const connect_db_with_retries = async (
  retries = database_retries,
  delay = database_delay
) => {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      logger.info(`DB Connection success`);
      return sequelize;
    } catch (err) {
      logger.error(`Retry:${retries}, Error in DB Connection: ${err}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      retries--;
    }
  }
};

module.exports = { sequelize, connect_db_with_retries };
