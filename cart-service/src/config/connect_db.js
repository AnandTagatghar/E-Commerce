const mongoose = require("mongoose");
const { database_name } = require("../constant");
const logger = require("./logger");

const connect_to_db = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${database_name}`);
    logger.info(`Connection to MongoDB success`);
  } catch (error) {
    logger.error(`Error connecting MongoDB: ${error.message}`);
  }
};

module.exports = connect_to_db;
