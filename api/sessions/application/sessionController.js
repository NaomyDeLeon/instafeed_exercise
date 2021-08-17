let repository;
let validator;
let logger;

const getToken = async (req, res) => {
    const validation = await validator(req.body);
    if (validation.isValid) {
        const login = await repository.createUserToken(req.body);
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
    repository = config.repository;
    validator = config.validator;
    logger = config.logger;
    return {
        getToken,
    };
};
