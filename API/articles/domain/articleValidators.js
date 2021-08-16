const JSONvalidator = require('../../util/validation');

let schemaRules;
const articleValidator = async (articleJSON) => {
    const result = await JSONvalidator.validateManually(
        articleJSON,
        schemaRules.manual
    );
    return result;
};

const articleYupValidator = async (articleJSON) => {
    const result = await JSONvalidator.validateWithYup(
        articleJSON,
        schemaRules.yup
    );
    return result;
};

module.exports = (rules) => {
    schemaRules = rules;
    return {
        articleYupValidator,
        articleValidator,
    };
};
