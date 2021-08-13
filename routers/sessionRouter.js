const rootPath = '';

module.exports = (router, manager, validator, logger) => {
    router.post(rootPath, async (req, res) => {
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
    });

    return router;
};
