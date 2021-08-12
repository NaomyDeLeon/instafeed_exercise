const rootPath = '';

module.exports = (router, manager, validator) => {
    router.post(rootPath, async (req, res) => {
        const validation = await validator(req.body, 'web');
        if (validation.isValid) {
            const login = await manager.login(req.body);
            if (login.success) res.status(200);
            else res.status(400);
            res.send(login);
        } else {
            res.status(400);
            res.send(validation.errors);
        }
        res.end();
    });

    return router;
};
