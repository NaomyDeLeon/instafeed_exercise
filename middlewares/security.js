const jwt = require('jsonwebtoken');

let tokenSign;
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
                    res.status(401);
                    res.send({ success: false, errors: 'do not allowed' });
                }
            } else next();
        } catch (err) {
            res.status(401);
            res.send({ success: false, errors: err });
        }
    }
};

module.exports = (sign) => {
    tokenSign = sign;
    return {
        tokenValidator,
    };
};
