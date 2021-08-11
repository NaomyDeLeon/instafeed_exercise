const schemaRules = require('./articleSchemaRules');
const JSONvalidator = require('../util/validation');

const articleValidationHandler = async (articleJSON, filename) => {
    console.info(`Starting validation with manual handler - file ${filename}`);
    const result = await JSONvalidator.validateManually(
        articleJSON,
        schemaRules.manual
    );
    return result;
};

const articleYupValidationHandler = async (articleJSON, filename) => {
    console.info(`Starting validation with yup handler - file ${filename}`);
    const result = await JSONvalidator.validateWithYup(
        articleJSON,
        schemaRules.yup
    );
    return result;
};

module.exports = {
    articleYupValidationHandler,
    articleValidationHandler,
};
