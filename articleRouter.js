const rootPath = '';
const singleArticlePath = '/:id';

module.exports = (injectedRouter, injectedManager, injectedValidator) => {
    injectedRouter.get(rootPath, async (req, res) => {
        const articles = await injectedManager.getArticles();
        if (articles) res.send(articles);
        else res.send('No records found');
        res.end();
    });

    injectedRouter.post(rootPath, async (req, res) => {
        const result = await injectedValidator(req.body, 'web');
        if (result.isValid) {
            const created = await injectedManager.createArticle(req.body);
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

    injectedRouter.get(singleArticlePath, async (req, res) => {
        const articleId = req.params.id;
        const article = await injectedManager.findArticle(articleId);
        if (article) res.send(article);
        else {
            res.status(404);
            res.send({ error: 'article not found' });
        }
        res.end();
    });

    injectedRouter.delete(singleArticlePath, async (req, res) => {
        const articleId = req.params.id;
        const article = await injectedManager.findArticle(articleId);
        if (article) {
            const deleted = await injectedManager.deleteArticle(articleId);
            if (deleted) {
                res.status(204);
                res.send({ msg: 'article deleted', id: articleId });
            }
        } else {
            res.status(404);
            res.send({ error: 'article not found' });
        }
        res.end();
    });

    injectedRouter.put(singleArticlePath, async (req, res) => {
        const articleId = req.params.id;
        const result = await injectedValidator(req.body, 'web');
        if (result.isValid) {
            const article = await injectedManager.findArticle(articleId);
            if (article) {
                const updated = await injectedManager.updateArticle(
                    articleId,
                    req.body
                );
                if (updated) {
                    res.status(200);
                    res.send({ msg: 'success' });
                    res.end();
                }
            } else {
                res.status(404);
                res.send({ error: 'article not found' });
            }
        }
        res.status(400);
        res.send(result.errors);
        res.end();
    });

    injectedRouter.patch(singleArticlePath, async (req, res) => {
        const articleId = req.params.id;
        const result = await injectedValidator(req.body, 'web');
        if (result.isValid) {
            const article = await injectedManager.findArticle(articleId);
            if (article) {
                const updated = await injectedManager.updateArticlePartially(
                    articleId,
                    req.body
                );
                if (updated) {
                    res.status(200);
                    res.send({ msg: 'success' });
                    res.end();
                }
            } else {
                res.status(404);
                res.send({ error: 'article not found' });
            }
        }
        res.status(400);
        res.send(result.errors);
        res.end();
    });

    return injectedRouter;
};
