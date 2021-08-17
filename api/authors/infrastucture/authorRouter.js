const rootPath = '';
const singleAuthorPath = '/:id';
let db;
let logger;

const schema = require('../domain/authorSchemaRules');
const { authorYupValidator } = require('../domain/authorValidators')(schema);
const repository = require('../domain/authorRepository')({ db });
const controller = require('../application/authorController')({
    validator: authorYupValidator,
    repository,
    logger,
});

module.exports = (config) => {
    db = config.db;
    logger = config.logger;
    const { router } = config;
    router.get(rootPath, controller.getAuthors);
    router.get(singleAuthorPath, controller.findAuthor);
    router.post(rootPath, controller.createAuthor);
    router.delete(singleAuthorPath, controller.deleteAuthor);
    router.put(singleAuthorPath, controller.updateAuthor);
    return router;
};
