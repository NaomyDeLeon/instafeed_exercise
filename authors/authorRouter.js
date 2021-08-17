const rootPath = '';
const singleauthorPath = '/:id';

module.exports = (injectedRouter, injectedManager, injectedValidator) => {
    injectedRouter.get(rootPath, async (req, res) => {
        const authors = await injectedManager.getAuthors();
        if (authors) res.send(authors);
        else res.send('No records found');
        res.end();
    });

    injectedRouter.post(rootPath, async (req, res) => {
        const result = await injectedValidator(req.body, 'web');
        if (result.isValid) {
            const created = await injectedManager.createAuthor(req.body);
            if (created) {
                res.status(201);
                res.send({ msg: 'success' });
                res.end();
            }
        }
        res.status(400);
        res.send(result.errors);
        res.end();
    });

    injectedRouter.get(singleauthorPath, async (req, res) => {
        const authorId = req.params.id;
        const author = await injectedManager.findAuthor(authorId);
        if (author) res.send(author);
        else {
            res.status(404);
            res.send({ error: 'author not found' });
        }
        res.end();
    });

    injectedRouter.delete(singleauthorPath, async (req, res) => {
        const authorId = req.params.id;
        const author = await injectedManager.findAuthor(authorId);
        if (author) {
            const deleted = await injectedManager.deleteAuthor(authorId);
            if (deleted) {
                res.status(204);
                res.send({ msg: 'author deleted', id: authorId });
            }
        } else {
            res.status(404);
            res.send({ error: 'author not found' });
        }
        res.end();
    });

    injectedRouter.put(singleauthorPath, async (req, res) => {
        const authorId = req.params.id;
        const result = await injectedValidator(req.body, 'web');
        if (result.isValid) {
            const author = await injectedManager.findAuthor(authorId);
            if (author) {
                const updated = await injectedManager.updateAuthor(
                    authorId,
                    req.body
                );
                if (updated) {
                    res.status(200);
                    res.send({ msg: 'success' });
                    res.end();
                }
            } else {
                res.status(404);
                res.send({ error: 'author not found' });
            }
        }
        res.status(400);
        res.send(result.errors);
        res.end();
    });

    return injectedRouter;
};
