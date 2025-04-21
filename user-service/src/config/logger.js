const { createLogger, transports, format } = require("winston");
const { errors, timestamp, colorize, simple, combine, printf } = format;
const dailyRotateFile = require("winston-daily-rotate-file");

const logFormat = printf(({ level, message, stack, timestamp }) => {
  return stack
    ? `${timestamp} : [${level}] : ${message} - ${stack}`
    : `${timestamp} : [${level}] : ${message}`;
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
      level: isProduction ? "info" : "debug",
      format: combine(colorize(), simple(), logFormat),
    }),
    new dailyRotateFile({
      filename: `logs/application-%DATE%.log`,
      maxFiles: `14d`,
      datePattern: `DD-MM-YYYY`,
      level: isProduction ? "info" : "debug",
    }),
    new transports.File({
      filename: `logs/errors.log`,
      level: isProduction ? "info" : "debug",
    }),
  ],
});

module.exports = logger;
