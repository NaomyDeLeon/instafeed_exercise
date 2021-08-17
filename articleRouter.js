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
                res.send('success');
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
            res.send('not found');
        }
        res.end();
    });

    return injectedRouter;
};
