const yup = require('yup');

const valueExist = (value) =>
    value !== undefined && value !== '' && value !== null;

const validateUsername = (value) => {
    if (!valueExist(value)) return 'name is necessary';
    if (typeof value !== 'string') return 'name field must be string';
    if (value.length > 15) return 'name length must be 100 or lower';
    if (value.length < 8) return 'name length must be 100 or lower';
    return null;
};

const validatePassword = (value) => {
    if (!valueExist(value)) return 'name is necessary';
    if (typeof value !== 'string') return 'name field must be string';
    if (value.length > 10) return 'name length must be 100 or lower';
    if (value.length < 8) return 'name length must be 100 or lower';
    return null;
};

const sessionSchemaManualRules = {
    username: { rule: validateUsername },
    password: { rule: validatePassword },
};

const sessionSchemaYUPRules = yup.object().shape({
    username: yup.string().min(8).max(15).nullable(false).required(),
    password: yup.string().min(8).max(10).nullable(false).required(),
});

const sessionSchemaRules = {
    manual: sessionSchemaManualRules,
    yup: sessionSchemaYUPRules,
};

module.exports = sessionSchemaRules;
