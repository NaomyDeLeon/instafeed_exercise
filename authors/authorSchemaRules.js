const yup = require('yup');

const valueExist = (value) =>
    value !== undefined && value !== '' && value !== null;

const validateArticles = (value) => {
    if (value === undefined || value.length <= 0) return null;
    if (!Array.isArray(value)) return 'Articles must be an Array';
    for (let x = 0; x < value.length; x += 1) {
        if (typeof value[x] !== 'string')
            return 'Articles must containt string values only';
        if (value[x].length < 36)
            return `Article id length must be exactly 36 - id: ${value[x]}`;
    }
    return null;
};
const validateName = (value) => {
    if (!valueExist(value)) return 'name is necessary';
    if (typeof value !== 'string') return 'name field must be string';
    if (value.length > 100) return 'name length must be 100 or lower';
    return null;
};

const authorSchemaManualRules = {
    name: { rule: validateName },
    articles: { rule: validateArticles },
};

const authorSchemaYUPRules = yup.object().shape({
    name: yup.string().max(100).nullable(false).required(),
    articles: yup.array().of(yup.string().length(36)),
});

const authorSchemaRules = {
    manual: authorSchemaManualRules,
    yup: authorSchemaYUPRules,
};

module.exports = authorSchemaRules;
