const { createLogger, transports, format } = require("winston");
const { timestamp, errors, colorize, combine, printf, simple } = format;
const daily_ratate_file = require("winston-daily-rotate-file");

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return stack
    ? `${timestamp} : [${level}] : ${message} - ${stack}`
    : `${timestamp} : [${level}] : ${message}`;
});

const is_production = process.env.NODE_ENV === "production";

const logger = createLogger({
  level: is_production ? "info" : "debug",
  format: combine(timestamp(), errors({ stack: true }), logFormat),
  exceptionHandlers: [
    new transports.File({ filename: `logs/exceptionHandlers.log` }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: `logs/rejectionHandlers.log` }),
  ],
  transports: [
    new transports.Console({
      level: is_production ? "info" : "debug",
      format: combine(colorize(), simple(), logFormat),
    }),

    new transports.File({ filename: `logs/errors.log` }),

    new daily_ratate_file({
      level: is_production ? "info" : "debug",
      datePattern: "DD-MM-YYYY",
      maxFiles: "14d",
      filename: `logs/application-%DATE%.log`,
    }),
  ],
});

module.exports = logger;
