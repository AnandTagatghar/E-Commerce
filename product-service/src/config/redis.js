const Redis = require("ioredis");
const logger = require("./logger");

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

redis.on("connect", () => {
  logger.info(`Connected to redis`);
});

redis.on("error", (error) => {
  logger.error(`Error on redis connection: ${error}`);
});

redis.on("disconnect", () => {
  logger.info(`Disconnected to redis`);
});

module.exports = redis;
