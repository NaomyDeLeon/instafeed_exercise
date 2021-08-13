const JSONvalidator = require('../util/validation');

let schemaRules;

const authorValidationHandler = async (authorJSON) => {
    const result = await JSONvalidator.validateManually(
        authorJSON,
        schemaRules.manual
    );
    return result;
};

const authorYupValidationHandler = async (authorJSON) => {
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
