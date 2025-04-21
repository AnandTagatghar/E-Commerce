require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/db");
const logger = require("./config/logger");

sequelize
  .authenticate()
  .then(() => {
    logger.info(`DB Connection success`);

    app.listen(process.env.PORT, () => {
      logger.info(
        `Server listening at port : http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    logger.error(`Error in DB Connection: ${err}`);
  });
