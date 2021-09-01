const assert = require('assert');
const articleSchemaRules = require('../api/articles/domain/articleSchemaRules');
const { articleYupValidationHandler, articleValidationHandler } =
    require('../api/articles/domain/articleValidators')(articleSchemaRules);

const authorSchemaRules = require('../api/authors/domain/authorSchemaRules');
const { authorYupValidationHandler, authorValidationHandler } =
    require('../api/authors/domain/authorValidators')(authorSchemaRules);

const validArticle = {
    id: '4a71a18a-b31e-427e-84f3-127a1273fxxa',
    title: 'Understanding Node.js File System Modulesssssssz',
    url: 'https://levelup.gitconnected.com/understanding-node-js-file-system-module-b16da1e01949',
    keywords: ['Nodejs', 'Filesystem', 'other'],
    modifiedAt: '06/24/2019',
    publishedAt: '06/24/2019',
    author: '7a7436e0-fb89-11eb-8400-af38f0371ad8',
    readMins: 3,
    source: 'BLOG',
};

const invalidArticle = {
    id: '4a71a18a-b31e-427e-84f3-127a1273fxxa',
    title: 'Understanding Node.js File System Modulesssssssz',
    url: 'https://levelup.gitconnected.com/understanding-node-js-file-system-module-b16da1e01949',
    keywords: ['Nodejs', 'Filesystem', 'other'],
    modifiedAt: '06/24/2019',
    publishedAt: '06/24/2019',
    readMins: 3,
    source: 'BLOG',
};

const validAuthor = {
    name: 'naomy 4',
};

const invalidAuthor = {
    nam: 'naomy 4',
};

/* eslint-disable no-undef */
describe('Validator', () => {
    describe('articles validator', () => {
        it('should return false when the article data is not valid', async () => {
            const result = await articleYupValidationHandler(
                invalidArticle,
                'testing'
            );
            assert.equal(result.isValid, false);
        });
        it('should return true when the article data is valid', async () => {
            const result = await articleYupValidationHandler(
                validArticle,
                'testing'
            );
            assert.equal(result.isValid, true);
        });
        it('should return false when the article data is not valid', async () => {
            const result = await articleValidationHandler(
                invalidArticle,
                'testing'
            );
            assert.equal(result.isValid, false);
        });
        it('should return true when the article data is valid', async () => {
            const result = await articleValidationHandler(
                validArticle,
                'testing'
            );
            assert.equal(result.isValid, true);
        });
    });
    describe('author validator', () => {
        it('should return false when the author data is not valid', async () => {
            const result = await authorYupValidationHandler(
                invalidAuthor,
                'testing'
            );
            assert.equal(result.isValid, false);
        });
        it('should return true when the author data is valid', async () => {
            const result = await authorYupValidationHandler(
                validAuthor,
                'testing'
            );
            assert.equal(result.isValid, true);
        });
        it('should return false when the author data is not valid', async () => {
            const result = await authorValidationHandler(
                invalidAuthor,
                'testing'
            );
            assert.equal(result.isValid, false);
        });
        it('should return true when the author data is valid', async () => {
            const result = await authorValidationHandler(
                validAuthor,
                'testing'
            );
            assert.equal(result.isValid, true);
        });
    });
});
