const { createLogger, transports, format } = require("winston");
const { combine, errors, timestamp, colorize, simple, printf } = format;
const daily_rotate_file = require("winston-daily-rotate-file");

const isProduction = process.env.NODE_ENV === "production";

const logFormat = printf(({ level, message, stack, timestamp }) => {
  return stack
    ? `${timestamp} : [${level}] : ${message} - ${stack}`
    : `${timestamp} : [${level}] : ${message}`;
});

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

    new daily_rotate_file({
      filename: `logs/application-%DATE%.log`,
      level: isProduction ? "info" : "debug",
      maxFiles: "14d",
      datePattern: "DD-MM-YYYY",
    }),
  ],
});

module.exports = logger;
