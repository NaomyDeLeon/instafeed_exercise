const winston = require('winston');
require('winston-daily-rotate-file');

const logger = winston.createLogger({
    transports: [
        new winston.transports.DailyRotateFile({
            filename: 'application-%DATE%.log',
            dirname: `./logs/`,
            level: 'info',
            handleExceptions: true,
            colorize: true,
            json: false,
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
    exitOnError: false,
});

module.exports = logger;
