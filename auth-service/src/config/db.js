const { Sequelize } = require("sequelize");
const {
  database_name,
  database_retries,
  database_delay,
} = require("../constants");
const logger = require("./logger");

const sequelize = new Sequelize(
  database_name,
  process.env.DATABASE_USER_NAME,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    logging:false
  }
);

const connect_db_with_retries = async (
  retries = database_retries,
  delay = database_delay
) => {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      logger.info(`DB connection success`);
      return sequelize;
    } catch (error) {
      logger.error(
        `Retry: ${retries}, Error connecting to db: ${error.message}`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      retries--;
    }
  }

  throw new Error(
    `Unable to connect to the database after ${database_retries} attempts`
  );
};

module.exports = { sequelize, connect_db_with_retries };
