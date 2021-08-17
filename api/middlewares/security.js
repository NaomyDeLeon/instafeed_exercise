const jwt = require('jsonwebtoken');

let tokenSign;
let logger;
const tokenValidator = (req, res, next) => {
    const { path } = req;
    const { method } = req;
    const { headers } = req;
    if (path === '/sessions' || method === 'GET') {
        next();
    } else {
        try {
            const { authorization } = headers;
            const decoded = jwt.verify(authorization, tokenSign);
            if (method === 'DELETE') {
                if (decoded.role === 'admin') next();
                else {
                    const response = {
                        success: false,
                        errors: 'do not allowed',
                    };
                    res.status(401);
                    res.send(response);
                    logger(req, res, response);
                }
            } else next();
        } catch (err) {
            const response = { success: false, errors: err };
            res.status(401);
            res.send(response);
            logger(req, res, response);
        }
    }
};

module.exports = (sign, responseLogger) => {
    tokenSign = sign;
    logger = responseLogger;
    return {
        tokenValidator,
    };
};
