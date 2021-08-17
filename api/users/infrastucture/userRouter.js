const rootPath = '';
const singleUserPath = '/:id';
let db;
let passwordManager;
let logger;

const schema = require('../domain/userSchemaRules');
const { userYupValidator } = require('../domain/userValidators')(schema);
const repository = require('../domain/userRepository')({
    db,
    passwordManager,
});
const controller = require('../application/userController')({
    validator: userYupValidator,
    repository,
    logger,
});

module.exports = (config) => {
    passwordManager = config.passwordManager;
    db = config.db;
    logger = config.logger;
    const { router } = config;
    router.get(rootPath, controller.getUsers);
    router.get(singleUserPath, controller.findUser);
    router.post(rootPath, controller.createUser);
    router.delete(singleUserPath, controller.deleteUser);
    return router;
};
