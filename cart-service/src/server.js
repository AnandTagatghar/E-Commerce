require("dotenv").config();
const app = require("./app");
const connect_to_db = require("./config/connect_db");
const logger = require("./config/logger");

connect_to_db().then(() => {
  app.listen(process.env.PORT, () => {
    logger.info(
      `Server listening at port: http://localhost:${process.env.PORT}`
    );
  });
});
