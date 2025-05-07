// require("dotenv").config();
const app = require("./app");
const logger = require("./config/logger");

app.listen(process.env.PORT, () => {
  logger.info(`server listening at port: ${process.env.PORT}`);
});
