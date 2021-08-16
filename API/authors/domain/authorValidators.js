const JSONvalidator = require('../../util/validation');

let schemaRules;

const authorValidator = async (authorJSON) => {
    const result = await JSONvalidator.validateManually(
        authorJSON,
        schemaRules.manual
    );
    return result;
};

const authorYupValidator = async (authorJSON) => {
    const result = await JSONvalidator.validateWithYup(
        authorJSON,
        schemaRules.yup
    );
    return result;
};

module.exports = (rules) => {
    schemaRules = rules;
    return {
        authorYupValidator,
        authorValidator,
    };
};
