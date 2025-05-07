require("dotenv").config();
const app = require("./app");
const connect_to_db = require("./config/db_config");
const logger = require("./config/logger");

connect_to_db().then(() => {
  app.listen(process.env.PORT, () => {
    logger.http(
      `Server started and listening at http://localhost:${process.env.PORT}`
    );
  });
});
