const rootPath = '';
const singleArticlePath = '/:id';
const schema = require('../domain/articleSchemaRules');
const events = require('../../events/articleEventsManager');
const validators = require('../domain/articleValidators');
const repository = require('../domain/articleRepository');
const controller = require('../application/articleController');

module.exports = (config) => {
    const { redis } = config;
    const { db } = config;
    const { logger } = config;
    const { router } = config;
    const validator = validators(schema).articleYupValidator;
    const articleEvents = events(redis);
    const articleRepository = repository({ db, articleEvents });
    const articleController = controller({
        validator,
        repository: articleRepository,
        logger,
        redis,
    });
    router.get(rootPath, articleController.getArticles);
    router.post(rootPath, articleController.createArticle);
    router.get(singleArticlePath, articleController.findArticle);
    router.delete(singleArticlePath, articleController.deleteArticle);
    router.put(singleArticlePath, articleController.updateArticle);
    router.patch(singleArticlePath, articleController.updateArticlePartially);
    return router;
};
