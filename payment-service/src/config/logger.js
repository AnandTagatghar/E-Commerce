const { createLogger, transports, format } = require("winston");
const { colorize, simple, timestamp, errors, combine, printf } = format;
const daily_ratate_file = require("winston-daily-rotate-file");

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return stack
    ? `${timestamp} : [${level}] : ${message} - ${stack}`
    : `${timestamp} : [${level}] : ${message}`;
});

const isProduction = process.env.NODE_ENV === "production";

const logger = createLogger({
  level: isProduction ? "info" : "debug",
  format: combine(errors({ stack: true }), timestamp(), logFormat),
  exceptionHandlers: [
    new transports.File({ filename: `logs/exceptionHandlers.log` }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: `logs/rejectionHandlers.log` }),
  ],
  transports: [
    new transports.Console({
      level: isProduction ? "info" : "debug",
      format: combine(colorize(), simple(), logFormat),
    }),
    new transports.File({ filename: `logs/errors.log` }),
    new daily_ratate_file({
      level: isProduction ? "info" : "dbug",
      maxFiles: "14d",
      datePattern: "DD-MM-YYYY",
      filename: `logs/application-%DATE%.log`,
    }),
  ],
});

module.exports = logger;
