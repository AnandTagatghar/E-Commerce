require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/db");
const logger = require("./config/logger");

sequelize
  .authenticate()
  .then(() => {
    logger.info(`Database connected successful`);

    app.listen(process.env.PORT, () => {
      logger.info(
        `Server is listening at http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    logger.error(`Database connection error: ${err.message}`);
  });
