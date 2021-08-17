const logger = require('../../util/logger');

const requestLogger = (req, res, next) => {
    let content = '';
    if (req.body) {
        content = JSON.stringify(req.body, null, 2);
    }
    logger.log(
        'info',
        `Request received - ${req.originalUrl} - ${req.method} - ${req.ip} ${content}`
    );
    next();
};

const responseLogger = (req, res, body) => {
    let content = '';
    if (body) {
        content = JSON.stringify(body, null, 2);
    }
    logger.log(
        'info',
        `Response - ${req.originalUrl} - ${req.method} - ${req.ip} -${res.statusCode}- ${content}`
    );
};

module.exports = { requestLogger, responseLogger };
