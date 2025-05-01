const redis = require("../config/redis");
const { redis_expiry_time_in_seconds } = require("../constants");

/**
 *
 * @param {key:String} key
 * @param {value:String} value
 * @returns
 */
async function setDataToRedis(key, value) {
  return await redis.set(
    key,
    JSON.stringify(value),
    "EX",
    redis_expiry_time_in_seconds
  );
}

/**
 *
 * @param {key:String} key
 * @returns
 */
async function getDataFromRedis(key) {
  let value = await redis.get(key);
  return JSON.parse(value);
}

module.exports = {
  setDataToRedis,
  getDataFromRedis,
};
