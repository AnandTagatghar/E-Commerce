require("dotenv").config();
const connect_db = require("./config/connect_db");
const app = require("./app");
const logger = require("./config/logger");

connect_db().then(() => {
  app.listen(process.env.PORT, () => {
    logger.info(`Server started and listening at http://localhost:${process.env.PORT}`);
  })
});