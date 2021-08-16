const JSONvalidator = require('../../util/validation');

let schemaRules;
const userValidator = async (userJSON) => {
    const result = await JSONvalidator.validateManually(
        userJSON,
        schemaRules.manual
    );
    return result;
};

const userYupValidator = async (userJSON) => {
    const result = await JSONvalidator.validateWithYup(
        userJSON,
        schemaRules.yup
    );
    return result;
};

module.exports = (rules) => {
    schemaRules = rules;
    return {
        userYupValidator,
        userValidator,
    };
};
