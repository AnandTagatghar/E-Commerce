const { Kafka } = require("kafkajs")

const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["192.168.1.11:9092"],
});

module.exports = {
  kafka,
};