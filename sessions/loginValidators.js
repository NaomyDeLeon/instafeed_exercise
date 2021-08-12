const schemaRules = require('./loginSchemaRules');
const JSONvalidator = require('../util/validation');

const userValidationHandler = async (loginJSON, filename) => {
    console.info(`Starting validation with manual handler - file ${filename}`);
    const result = await JSONvalidator.validateManually(
        loginJSON,
        schemaRules.manual
    );
    return result;
};

const userYupValidationHandler = async (loginJSON, filename) => {
    console.info(`Starting validation with yup handler - file ${filename}`);
    const result = await JSONvalidator.validateWithYup(
        loginJSON,
        schemaRules.yup
    );
    return result;
};

module.exports = {
    userYupValidationHandler,
    userValidationHandler,
};
