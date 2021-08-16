const rootPath = '';
const singleArticlePath = '/:id';

module.exports = (router, manager, validator, logger, cacheManager) => {
    router.get(rootPath, async (req, res) => {
        const articles = await manager.getArticles();
        res.send(articles);
        logger(req, res, articles);
        res.end();
    });

    router.get(singleArticlePath, (req, res) => {
        const articleId = req.params.id;
        res.set('Cache-control', 'public, max-age=3600');
        cacheManager.get(`article-${articleId}`, async (err, storedArticle) => {
            if (err) logger.err(err);
            if (storedArticle !== null) {
                res.send(JSON.parse(storedArticle));
            } else {
                const article = await manager.findArticle(articleId);
                if (article.success) {
                    res.send(article.data);
                } else {
                    res.status(404);
                    res.send(article);
                    logger(req, res, article);
                }
            }
            res.end();
        });
    });

    router.post(rootPath, async (req, res) => {
        const validation = await validator(req.body);
        if (validation.isValid) {
            const creation = await manager.createArticle(req.body);
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

    router.delete(singleArticlePath, async (req, res) => {
        const articleId = req.params.id;
        const deletion = await manager.deleteArticle(articleId);
        if (deletion.success) res.status(204);
        else {
            res.status(404);
            res.send(deletion);
        }
        logger(req, res, deletion);
        res.end();
    });

    router.put(singleArticlePath, async (req, res) => {
        const articleId = req.params.id;
        const validation = await validator(req.body);
        if (validation.isValid) {
            const update = await manager.updateArticle(articleId, req.body);
            if (update.success) res.status(200);
            else res.status(404);
            res.send(update);
            logger(req, res, update);
        } else {
            res.status(400);
            res.send(validation.errors);
            logger(req, res, validation);
        }
        res.end();
    });

    router.patch(singleArticlePath, async (req, res) => {
        const articleId = req.params.id;
        const validation = await validator(req.body);
        if (validation.isValid) {
            const update = await manager.updateArticlePartially(
                articleId,
                req.body
            );
            if (update.success) res.status(200);
            else res.status(400);
            res.send(update);
            logger(req, res, update);
        } else {
            res.status(400);
            res.send(validation.errors);
            logger(req, res, validation);
        }
        res.end();
    });

    return router;
};
