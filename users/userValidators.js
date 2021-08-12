const schemaRules = require('./userSchemaRules');
const JSONvalidator = require('../util/validation');

const userValidationHandler = async (userJSON, filename) => {
    console.info(`Starting validation with manual handler - file ${filename}`);
    const result = await JSONvalidator.validateManually(
        userJSON,
        schemaRules.manual
    );
    return result;
};

const userYupValidationHandler = async (userJSON, filename) => {
    console.info(`Starting validation with yup handler - file ${filename}`);
    const result = await JSONvalidator.validateWithYup(
        userJSON,
        schemaRules.yup
    );
    return result;
};

module.exports = {
    userYupValidationHandler,
    userValidationHandler,
};
