const JSONvalidator = require('../util/validation');

let schemaRules;
const sessionValidationHandler = async (sessionJSON) => {
    const result = await JSONvalidator.validateManually(
        sessionJSON,
        schemaRules.manual
    );
    return result;
};

const sessionYupValidationHandler = async (sessionJSON) => {
    const result = await JSONvalidator.validateWithYup(
        sessionJSON,
        schemaRules.yup
    );
    return result;
};

module.exports = (rules) => {
    schemaRules = rules;
    return {
        sessionYupValidationHandler,
        sessionValidationHandler,
    };
};
