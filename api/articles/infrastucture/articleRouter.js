const rootPath = '';
const singleArticlePath = '/:id';
let db;
let redis;
let logger;

const schema = require('../domain/articleSchemaRules');
const events = require('../../events/articleEventsManager')(redis);
const { articleYupValidator } = require('../domain/articleValidators')(schema);
const repository = require('../domain/articleRepository')({ db, events });
const controller = require('../application/articleController')({
    validator: articleYupValidator,
    repository,
    logger,
    redis,
});

module.exports = (config) => {
    redis = config.redis;
    db = config.mongo;
    logger = config.logger;
    const { router } = config;
    router.get(rootPath, controller.getArticles);
    router.post(rootPath, controller.createArticle);
    router.get(singleArticlePath, controller.findArticle);
    router.delete(singleArticlePath, controller.deleteArticle);
    router.put(singleArticlePath, controller.updateArticle);
    router.patch(singleArticlePath, controller.updateArticlePartially);
    return router;
};
