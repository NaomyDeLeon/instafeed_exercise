const rootPath = '';
const singleUserPath = '/:id';
const schema = require('../domain/userSchemaRules');
const validators = require('../domain/userValidators');
const repository = require('../domain/userRepository');
const controller = require('../application/userController');

module.exports = (config) => {
    const { passwordManager } = config;
    const { db } = config;
    const { logger } = config;
    const { router } = config;
    const validator = validators(schema).userYupValidator;
    const userRepository = repository({
        db,
        passwordManager,
    });
    const userController = controller({
        validator,
        repository: userRepository,
        logger,
    });
    router.get(rootPath, userController.getUsers);
    router.get(singleUserPath, userController.findUser);
    router.post(rootPath, userController.createUser);
    router.delete(singleUserPath, userController.deleteUser);
    return router;
};
