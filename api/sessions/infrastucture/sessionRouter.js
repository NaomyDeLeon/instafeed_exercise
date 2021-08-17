const rootPath = '';
let db;
let passwordManager;
let logger;

const schema = require('../domain/sessionSchemaRules');
const { sessionYupValidator } = require('../domain/sessionValidators')(schema);
const repository = require('../application/sessionRepository')({
    db,
    passwordManager,
});
const controller = require('../application/sessionController')({
    repository,
    validator: sessionYupValidator,
    logger,
});

module.exports = (config) => {
    const { router } = config;
    logger = config.logger;
    passwordManager = config.passwordManager;
    router.post(rootPath, controller.getToken);
    return router;
};
