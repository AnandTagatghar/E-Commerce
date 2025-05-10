const { kafka } = require("../config/kafka.connect");
const logger = require("../config/logger");

const consumer = kafka.consumer({ groupId: "test-order-service" });

const startConsumer = async () => {
  await consumer.connect();
  logger.info(`Kafka consumer connected`);
  await consumer.subscribe({ topic: "order-service", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message, topic, partition }) => {
      logger.info(message.value.toString());
    },
  });
};

module.exports = { startConsumer };
