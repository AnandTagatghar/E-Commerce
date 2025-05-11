const mongoose = require("mongoose");
const { database_name } = require("../constants");
const logger = require("./logger");

async function connect_db() {
  await mongoose
    .connect(`${process.env.MONGODB_URI}/${database_name}`)
    .then(() => {
      logger.info(`MongoDB connections successful`);
    })
    .catch((error) => {
      logger.error(`Error in connection to MongoDB: ${error.message}`);
    });
}

module.exports = connect_db;
