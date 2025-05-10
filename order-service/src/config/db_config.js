const mongoose = require("mongoose");
const logger = require("./logger");
const { database_name } = require("../constants");

async function connect_to_db() {
  try {
    await mongoose
      .connect(`${process.env.MONGODB_URI}/${database_name}`)
      .then(() => {
        logger.info(`Connecting to MongoDB success`);
      })
      .catch((err) => {
        throw new Error(`Error connecting to MongoDB: ${err.message}`);
      });
  } catch (error) {
    throw new Error(`Error connecting to MongoDB: ${error.message}`);
  }
}

module.exports = connect_to_db;
