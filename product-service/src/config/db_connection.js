const mongoose = require("mongoose");
const logger = require("./logger");
const { database_name } = require("../constants");

async function db_connection() {
  try {
    await mongoose
      .connect(`${process.env.MONGODB_URI}/${database_name}`)
      .then(() => {
        logger.info(`Mongo DB connection success`);
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (error) {
    logger.error(`Error in Mongo DB connection: ${error.message}`);
    console.log(error);
  }
}

module.exports = { db_connection };
