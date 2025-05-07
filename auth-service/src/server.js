// require("dotenv").config();
const app = require("./app");
const { connect_db_with_retries } = require("./config/db");
const logger = require("./config/logger");

(async () => {
  try {
    await connect_db_with_retries();
    app.listen(process.env.PORT, () => {
      logger.info(
        `Server is listening at http://localhost:${process.env.PORT}`
      );
    });
  } catch (error) {
    logger.error(`Database connection error: ${error.message}`);
  }
})();
