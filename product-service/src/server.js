require("dotenv").config();
const app = require("./app");
const { db_connection } = require("./config/db_connection");
const logger = require("./config/logger");

db_connection().then(() => {
  app.listen(process.env.PORT, () => {
    logger.http(`listening at http://localhost:${process.env.PORT}`);
  });
});
