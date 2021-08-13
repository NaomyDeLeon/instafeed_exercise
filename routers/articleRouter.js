const rootPath = '';
const singleArticlePath = '/:id';

module.exports = (router, manager, validator) => {
    router.get(rootPath, async (req, res) => {
        const articles = await manager.getArticles();
        res.send(articles);
        res.end();
    });

    router.get(singleArticlePath, async (req, res) => {
        const articleId = req.params.id;
        const article = await manager.findArticle(articleId);
        if (article) res.send(article.data);
        else {
            res.status(404);
            res.send(article);
        }
        res.end();
    });

    router.post(rootPath, async (req, res) => {
        const validation = await validator(req.body, 'web');
        if (validation.isValid) {
            const creation = await manager.createArticle(req.body);
            if (creation.success) res.status(201);
            else res.status(400);
            res.send(creation);
        } else {
            res.status(400);
            res.send(validation.errors);
        }
        res.end();
    });

    router.delete(singleArticlePath, async (req, res) => {
        const articleId = req.params.id;
        const deletion = await manager.deleteArticle(articleId);
        if (deletion.success) res.status(204);
        else {
            res.status(404);
            res.send(deletion);
        }
        res.end();
    });

    router.put(singleArticlePath, async (req, res) => {
        const articleId = req.params.id;
        const validation = await validator(req.body, 'web');
        if (validation.isValid) {
            const update = await manager.updateArticle(articleId, req.body);
            if (update.success) res.status(200);
            else res.status(404);
            res.send(update);
        } else {
            res.status(400);
            res.send(validation.errors);
        }
        res.end();
    });

    router.patch(singleArticlePath, async (req, res) => {
        const articleId = req.params.id;
        const validation = await validator(req.body, 'web');
        if (validation.isValid) {
            const update = await manager.updateArticlePartially(
                articleId,
                req.body
            );
            if (update.success) res.status(200);
            else res.status(400);
            res.send(update);
        } else {
            res.status(400);
            res.send(validation.errors);
        }
        res.end();
    });

    return router;
};
