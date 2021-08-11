const uuid = require('uuid');

let dbManager;
const collection = 'authors';
const authorStructure = {
    id: undefined,
    name: undefined,
    articles: [],
};

const getAuthors = async () => {
    const authors = await dbManager.findAll(collection);
    if (Array.isArray(authors) && authors.length === 0) return [];
    return authors;
};

const findAuthor = async (authorId) => {
    const results = await dbManager.find(collection, { id: authorId });
    if (Array.isArray(results) && results.length === 0) return undefined;
    return results;
};

const createAuthor = async (author) => {
    const authorToSave = { ...authorStructure, ...author };
    authorToSave.id = uuid.v1();
    const results = await dbManager.insert(collection, authorToSave);
    return results;
};

const deleteAuthor = async (authorId) => {
    const filter = { id: authorId };
    const results = await dbManager.remove(collection, filter);
    return results;
};

const updateAuthor = async (authorId, author) => {
    const filter = { id: authorId };
    const fieldsToUpdate = { ...authorStructure, ...author };
    delete fieldsToUpdate.id;
    const results = await dbManager.update(collection, filter, fieldsToUpdate);
    return results;
};

const updateAuthorPartially = async (authorId, author) => {
    const filter = { id: authorId };
    const fieldsToUpdate = author;
    if (fieldsToUpdate.hasOwnProperty('id')) {
        delete fieldsToUpdate.id;
    }
    const results = await dbManager.update(collection, filter, fieldsToUpdate);
    return results;
};

module.exports = (injectedDbManager) => {
    dbManager = injectedDbManager;
    return {
        getAuthors,
        findAuthor,
        createAuthor,
        deleteAuthor,
        updateAuthor,
        updateAuthorPartially,
    };
};
