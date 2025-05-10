require("dotenv").config();
const app = require("./app");
const connect_to_db = require("./config/db_config");
const logger = require("./config/logger");
const { startConsumer } = require("./utils/kafka.consumer");
const { startProducer } = require("./utils/kafka.producer");

connect_to_db()
  .then(async() => {
    // await startProducer();
    // await startConsumer();
    
    app.listen(process.env.PORT, () => {
      logger.http(
        `Server started and listening at http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    logger.error(`Error starting server: ${error.message}`);
    process.exit(1);
  });
