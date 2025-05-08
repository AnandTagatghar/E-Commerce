const redis = require("../config/redis.connection");
const logger = require("../config/logger");
const { redis_expiration } = require("../constant");

async function setRedisKey(key, value) {
  try {
    return await redis.set(key, JSON.stringify(value), "EX", redis_expiration);
  } catch (error) {
    logger.error("Error setting Redis key:", error.message);
  }
}
async function getRedisKey(key) {
  try {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error("Error getting Redis key:", error.message);
    return null;
  }
}
async function deleteRedisKey(key) {
  try {
    await redis.del(key);
  } catch (error) {
    logger.error("Error deleting Redis key:", error.message);
  }
}

module.exports = {
  setRedisKey,
  getRedisKey,
  deleteRedisKey,
};
