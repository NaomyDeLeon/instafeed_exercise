const rootPath = '';
const singleAuthorPath = '/:id';

module.exports = (router, manager, validator) => {
    router.get(rootPath, async (req, res) => {
        const authors = await manager.getAuthors();
        res.send(authors);
        res.end();
    });

    router.get(singleAuthorPath, async (req, res) => {
        const authorId = req.params.id;
        const search = await manager.findAuthor(authorId);
        if (search.success) res.send(search.data);
        else {
            res.status(404);
            res.send(search);
        }
        res.end();
    });

    router.post(rootPath, async (req, res) => {
        const validation = await validator(req.body, 'web');
        if (validation.isValid) {
            const creation = await manager.createAuthor(req.body);
            if (creation.success) res.status(201);
            else res.status(400);
            res.send(creation);
        } else {
            res.status(400);
            res.send(validation.errors);
        }
        res.end();
    });

    router.delete(singleAuthorPath, async (req, res) => {
        const authorId = req.params.id;
        const deletion = await manager.deleteAuthor(authorId);
        if (deletion.success) res.status(204);
        else {
            res.status(404);
            res.send(deletion);
        }
        res.end();
    });

    router.put(singleAuthorPath, async (req, res) => {
        const authorId = req.params.id;
        const validation = await validator(req.body, 'web');
        if (validation.isValid) {
            const update = await manager.updateAuthor(authorId, req.body);
            if (update.success) res.status(200);
            else res.status(404);
            res.send(update);
        } else {
            res.status(400);
            res.send(validation.errors);
        }
        res.end();
    });

    return router;
};
