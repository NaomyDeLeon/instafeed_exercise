const JSONvalidator = require('../util/validation');

let schemaRules;
const userValidationHandler = async (userJSON) => {
    const result = await JSONvalidator.validateManually(
        userJSON,
        schemaRules.manual
    );
    return result;
};

const userYupValidationHandler = async (userJSON) => {
    const result = await JSONvalidator.validateWithYup(
        userJSON,
        schemaRules.yup
    );
    return result;
};

module.exports = (rules) => {
    schemaRules = rules;
    return {
        userYupValidationHandler,
        userValidationHandler,
    };
};
