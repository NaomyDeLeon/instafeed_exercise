let manager;
let validator;
let logger;

const getToken = async (req, res) => {
    const validation = await validator(req.body);
    if (validation.isValid) {
        const login = await manager.createUserToken(req.body);
        if (login.success) res.status(200);
        else res.status(400);
        res.send(login);
        logger(req, res, login);
    } else {
        res.status(400);
        res.send(validation.errors);
        logger(req, res, validation);
    }
    res.end();
};

module.exports = (config) => {
    manager = config.manager;
    validator = config.validator;
    logger = config.logger;
    return {
        getToken,
    };
};
