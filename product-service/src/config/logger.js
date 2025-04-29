const { createLogger, transports, format } = require("winston");
const { printf, combine, errors, timestamp, colorize, simple } = format;
const dailyRotateFile = require("winston-daily-rotate-file");

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return stack
    ? `${timestamp} :[${level}] : ${message} - ${stack}`
    : `${timestamp} :[${level}] : ${message}`;
});

const isProduction = process.env.NODE_ENV === "production";

const logger = createLogger({
  level: isProduction ? "info" : "debug",
  format: combine(timestamp(), errors({ stack: true }), logFormat),
  exceptionHandlers: [
    new transports.File({ filename: `logs/exceptionHandlers.log` }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: `logs/rejectionHandlers.log` }),
  ],
  transports: [
    new transports.Console({
      level: isProduction ? "info" : "silly",
      format: combine(colorize(), simple(), logFormat),
    }),

    new transports.File({ filename: `logs/errors.log` }),
    new dailyRotateFile({
      level: isProduction ? "info" : "debug",
      maxFiles: "14d",
      filename: `logs/application-%DATE%.log`,
      datePattern: `DD-MM-YYYY`,
    }),
  ],
});

module.exports = logger;
