const yup = require('yup');

const roles = ['admin', 'other'];
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

const validateRole = (value) => {
    if (!valueExist(value)) return 'role field is required';
    if (!roles.includes(value))
        return `Source field value must be one of these ${roles}`;
    return null;
};

const authorSchemaManualRules = {
    username: { rule: validateUsername },
    password: { rule: validatePassword },
    roles: { rule: validateRole },
};

const authorSchemaYUPRules = yup.object().shape({
    username: yup.string().min(8).max(15).nullable(false).required(),
    password: yup.string().min(8).max(10).nullable(false).required(),
    role: yup.string().oneOf(roles).required(),
});

const authorSchemaRules = {
    manual: authorSchemaManualRules,
    yup: authorSchemaYUPRules,
};

module.exports = authorSchemaRules;
