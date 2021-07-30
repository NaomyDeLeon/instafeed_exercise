const yup = require('yup');

const httpsRegex = new RegExp('^(https)://', 'i');
const sourceTypes = ['ARTICLE', 'BLOG', 'TWEET', 'NEWSPAPER'];

function valueExist(value) {
    return value !== undefined && value !== '' && value !== null;
}
function validateId(value) {
    if (!valueExist(value)) return 'Id is required';
    if (typeof value !== 'string') return 'Id must be string';
    if (value.length !== 36) return 'Id length must be 36';
    return null;
}
function validateTitle(value) {
    if (!valueExist(value)) return 'Title is required';
    if (typeof value !== 'string') return 'Title must be string';
    if (value.length > 255) return 'Title length must be 255 or lower';
    return null;
}

function validateKeywords(value) {
    if (value === undefined || value.length <= 0)
        return 'At least 1 Keyword is necessary';
    if (!Array.isArray(value)) return 'Keywords must be an Array';
    if (value.length > 3) return 'Max keywords length is 3';
    return null;
}
function validateAuthor(value) {
    if (!valueExist(value)) return 'Author is necessary';
    if (typeof value !== 'string') return 'Author field must be string';
    if (value.length > 100) return 'Author length must be 100 or lower';
    return null;
}
function validateReadMins(value) {
    if (value === undefined) return 'Read mins field is required';
    if (typeof value !== 'number') return 'Read mins must be type number';
    if (value <= 0) return 'Read mins must be 1 or higher';
    if (value > 20) return 'Read mins must be 20 or lower';
    return null;
}
function validateSource(value) {
    if (!valueExist(value)) return 'Source field is required';
    if (!sourceTypes.includes(value))
        return `Source field value must be one of these ${sourceTypes}`;
    return null;
}

function validateModifiedAt(value) {
    if (value === undefined || value === null || value === '')
        return 'ModifiedAt field is required';
    try {
        const receivedDate = new Date(value);
        const parsedDate = Date.parse(receivedDate);
        if (isNaN(parsedDate) === true) {
            return 'ModifiedAt Invalid date format is mm/dd/yyyy';
        }
        if (
            new Date(receivedDate.toDateString()) >=
            new Date(new Date().toDateString())
        )
            return 'ModifiedAt must be a past date';
    } catch (err) {
        return 'ModifiedAt Invalid date format is mm/dd/yyyy';
    }
    return null;
}

function validatePublishedAt(value) {
    if (value === undefined || value === '') return null;
    try {
        const receivedDate = new Date(value);
        const parsedDate = Date.parse(receivedDate);
        if (isNaN(parsedDate) === true) {
            return 'PublishedAt Invalid date format is mm/dd/yyyy';
        }
        if (
            new Date(receivedDate.toDateString()) >=
            new Date(new Date().toDateString())
        )
            return 'PublishedAt must be a past date';
    } catch (err) {
        return 'PublishedAt Invalid date format is mm/dd/yyyy';
    }
    return null;
}

function validateURL(value, publishedAt) {
    if (
        (publishedAt === null || publishedAt === '') &&
        (value === null || value === '')
    )
        return null;
    if (!valueExist(value)) return 'URL field is required';
    if (!value.startsWith('https://'))
        return 'URL field must start with https://';
    return null;
}

const articleSchemaManualRules = {
    id: { rule: (value) => validateId(value) },
    title: { rule: (value) => validateTitle(value) },
    modifiedAt: { rule: (value) => validateModifiedAt(value) },
    publishedAt: { rule: (value) => validatePublishedAt(value) },
    keywords: { rule: (value) => validateKeywords(value) },
    author: { rule: (value) => validateAuthor(value) },
    readMins: { rule: (value) => validateReadMins(value) },
    source: { rule: (value) => validateSource(value) },
    url: {
        dependencyField: 'publishedAt',
        dependencyRule: (value, dependency) => validateURL(value, dependency),
    },
};
const articleSchemaYUPRules = yup.object().shape({
    id: yup.string().length(36).nullable(false).required(),
    title: yup.string().max(255).nullable(false).required(),
    author: yup.string().max(100).nullable(false).required(),
    keywords: yup.array().min(1).max(3).of(yup.string()),
    readMins: yup.number().positive().integer().min(1).max(20).required(),
    source: yup.string().oneOf(sourceTypes).required(),
    modifiedAt: yup
        .date()
        .max(new Date(Date.now() - 86400000))
        .nullable(false)
        .required(),
    publishedAt: yup
        .date()
        .nullable(true)
        .default(null)
        .max(new Date(Date.now() - 86400000))
        .transform((receivedDate) => {
            const parsedDate = Date.parse(receivedDate);
            if (isNaN(parsedDate) === true) {
                return null;
            }
            return receivedDate;
        }),
    url: yup
        .string()
        .url()
        .nullable(false)
        .when('publishedAt', {
            is: (publishedAt) => {
                return (
                    publishedAt === null ||
                    publishedAt === '' ||
                    publishedAt === undefined
                );
            },
            then: yup.string().url().nullable(true).notRequired(),
            otherwise: yup
                .string()
                .url()
                .nullable(false)
                .required()
                .matches(httpsRegex, 'URL must start with https://'),
        }),
});

const articleSchemaRules = {
    manual: articleSchemaManualRules,
    yup: articleSchemaYUPRules,
};

module.exports = articleSchemaRules;
