const rootPath = '';
const singleUserPath = '/:id';

module.exports = (router, manager, validator, logger) => {
    router.get(rootPath, async (req, res) => {
        const users = await manager.getUsers();
        res.send(users);
        logger(req, res, users);
        res.end();
    });

    router.get(singleUserPath, async (req, res) => {
        const userId = req.params.id;
        const search = await manager.findUser(userId);
        if (search.success) res.send(search.data);
        else {
            res.status(404);
            res.send(search);
        }
        logger(req, res, search);
        res.end();
    });

    router.post(rootPath, async (req, res) => {
        const validation = await validator(req.body);
        if (validation.isValid) {
            const creation = await manager.createUser(req.body);
            if (creation.success) res.status(201);
            else res.status(400);
            res.send(creation);
            logger(req, res, creation);
        } else {
            res.status(400);
            res.send(validation.errors);
            logger(req, res, validation);
        }
        res.end();
    });

    router.delete(singleUserPath, async (req, res) => {
        const userId = req.params.id;
        const deletion = await manager.deleteUser(userId);
        if (deletion.success) res.status(204);
        else {
            res.status(404);
            res.send(deletion);
        }
        logger(req, res, deletion);
        res.end();
    });

    return router;
};
