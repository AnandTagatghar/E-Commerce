const { kafka } = require("../config/kafka.connect");
const logger = require("../config/logger");

const producer = kafka.producer();

const startProducer = async () => {
  await producer.connect();
  logger.info(`Producre connected successuflly`);
};

const sendMessage = async (order) => {
  try {
    await producer.send({
      topic: "order-service",
      messages: [{ key: order.email, value: JSON.stringify(order) }],
    });
    logger.info(`Producer message sent`);

    await producer.disconnect();
    logger.info(`Proucer disconnected`);
  } catch (error) {
    logger.error("Error sending message:" + " " + error);
  }
};

module.exports = {
  startProducer,
  sendMessage,
};
