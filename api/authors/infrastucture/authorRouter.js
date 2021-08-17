const rootPath = '';
const singleAuthorPath = '/:id';
const schema = require('../domain/authorSchemaRules');
const validators = require('../domain/authorValidators');
const repository = require('../domain/authorRepository');
const controller = require('../application/authorController');

module.exports = (config) => {
    const { db } = config;
    const { logger } = config;
    const { router } = config;
    const validator = validators(schema).authorYupValidator;
    const authorRepository = repository({ db });
    const authorController = controller({
        validator,
        repository: authorRepository,
        logger,
    });
    router.get(rootPath, authorController.getAuthors);
    router.get(singleAuthorPath, authorController.findAuthor);
    router.post(rootPath, authorController.createAuthor);
    router.delete(singleAuthorPath, authorController.deleteAuthor);
    router.put(singleAuthorPath, authorController.updateAuthor);
    return router;
};
