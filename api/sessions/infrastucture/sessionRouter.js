const rootPath = '';
const schema = require('../domain/sessionSchemaRules');
const validators = require('../domain/sessionValidators');
const repository = require('../domain/sessionRepository');
const controller = require('../application/sessionController');

module.exports = (config) => {
    const { db } = config;
    const { router } = config;
    const { logger } = config;
    const { passwordManager } = config;
    const validator = validators(schema).sessionYupValidator;
    const sessionRepository = repository({
        db,
        passwordManager,
    });
    const sessionController = controller({
        repository: sessionRepository,
        validator,
        logger,
    });
    router.post(rootPath, sessionController.getToken);
    return router;
};
