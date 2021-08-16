const rootPath = '';
const singleArticlePath = '/:id';
let db;
let redis;
let logger;

const schema = require('../domain/articleSchemaRules');
const events = require('../../events/articleEventsManager')(redis);
const { articleYupValidator } = require('../domain/articleValidators')(schema);
const manager = require('../application/articleManager')(db, events);
const articleController = require('../application/articleController')({
    validator: articleYupValidator,
    manager,
    logger,
    redis,
});

module.exports = (config) => {
    redis = config.redis;
    db = config.mongo;
    logger = config.logger;
    const { router } = config;
    router.get(rootPath, articleController.getArticles);
    router.get(singleArticlePath, articleController.findArticle);
    router.post(rootPath, articleController.createArticle);
    router.delete(singleArticlePath, articleController.deleteArticle);
    router.put(singleArticlePath, articleController.updateArticle);
    router.patch(singleArticlePath, articleController.updateArticlePartially);
    return router;
};
