const Redis = require("ioredis");
const logger = require("./logger");

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

redis.on("connect", () => {
  logger.info("Connected to Redis");
});

redis.on("error", (err) => {
  logger.error("Redis connection error:", err);
});

redis.on("end", () => {
  logger.info("Redis connection closed");
});

redis.on("disconnect", () => {
  logger.info(`Disconnected to redis`);
});

module.exports = redis;
