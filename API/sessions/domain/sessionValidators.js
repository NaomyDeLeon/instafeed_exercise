const JSONvalidator = require('../../util/validation');

let schemaRules;
const sessionValidator = async (sessionJSON) => {
    const result = await JSONvalidator.validateManually(
        sessionJSON,
        schemaRules.manual
    );
    return result;
};

const sessionYupValidator = async (sessionJSON) => {
    const result = await JSONvalidator.validateWithYup(
        sessionJSON,
        schemaRules.yup
    );
    return result;
};

module.exports = (rules) => {
    schemaRules = rules;
    return {
        sessionYupValidator,
        sessionValidator,
    };
};
