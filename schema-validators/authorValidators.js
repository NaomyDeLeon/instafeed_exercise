const JSONvalidator = require('../util/validation');

let schemaRules;

const authorValidationHandler = async (authorJSON, filename) => {
    console.info(`Starting validation with manual handler - file ${filename}`);
    const result = await JSONvalidator.validateManually(
        authorJSON,
        schemaRules.manual
    );
    return result;
};

const authorYupValidationHandler = async (authorJSON, filename) => {
    console.info(`Starting validation with yup handler - file ${filename}`);
    const result = await JSONvalidator.validateWithYup(
        authorJSON,
        schemaRules.yup
    );
    return result;
};

module.exports = (rules) => {
    schemaRules = rules;
    return {
        authorYupValidationHandler,
        authorValidationHandler,
    };
};
