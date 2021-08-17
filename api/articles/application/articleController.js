let validator;
let repository;
let logger;
let redis;
let events;

const getArticles = async (req, res) => {
    const articles = await repository.getArticles();
    res.send(articles);
    logger(req, res, articles);
    res.end();
};

const findArticle = (req, res) => {
    const articleId = req.params.id;
    res.set('Cache-control', 'public, max-age=3600');
    redis.get(`article-${articleId}`, async (err, storedArticle) => {
        if (err) logger.err(err);
        if (storedArticle !== null) {
            logger.log('INFO', 'returning from cache');
            res.send(JSON.parse(storedArticle));
        } else {
            const article = await repository.findArticle(articleId);
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
};

const createArticle = async (req, res) => {
    const validation = await validator(req.body);
    if (validation.isValid) {
        const creation = await repository.createArticle(req.body);
        if (creation.success) {
            events.emit('ArticleCreated', { data: req.body });
            res.status(201);
        } else res.status(400);
        res.send(creation);
        logger(req, res, creation);
    } else {
        res.status(400);
        res.send(validation.errors);
        logger(req, res, validation);
    }
    res.end();
};

const deleteArticle = async (req, res) => {
    const articleId = req.params.id;
    const deletion = await repository.deleteArticle(articleId);
    if (deletion.success) res.status(204);
    else {
        res.status(404);
        res.send(deletion);
    }
    logger(req, res, deletion);
    res.end();
};

const updateArticle = async (req, res) => {
    const articleId = req.params.id;
    const validation = await validator(req.body);
    if (validation.isValid) {
        const update = await repository.updateArticle(articleId, req.body);
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
};
const updateArticlePartially = async (req, res) => {
    const articleId = req.params.id;
    const validation = await validator(req.body);
    if (validation.isValid) {
        const update = await repository.updateArticlePartially(
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
};

module.exports = (config) => {
    validator = config.validator;
    repository = config.repository;
    logger = config.logger;
    redis = config.redis;
    events = config.events;
    return {
        getArticles,
        findArticle,
        createArticle,
        deleteArticle,
        updateArticle,
        updateArticlePartially,
    };
};
