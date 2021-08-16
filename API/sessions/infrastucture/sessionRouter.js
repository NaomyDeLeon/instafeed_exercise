const rootPath = '';
let db;
let passwordManager;
let tokenSign;
let logger;

const schema = require('../domain/sessionSchemaRules');
const { sessionYupValidator } = require('../domain/sessionValidators')(schema);
const manager = require('../application/sessionManager')(
    db,
    passwordManager,
    tokenSign
);
const controller = require('../application/sessionController')({
    manager,
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
