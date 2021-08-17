const uuid = require('uuid');

let db;
const collection = 'authors';
const authorStructure = {
    name: undefined,
    articles: [],
};

const getAuthors = async () => {
    const authors = await db.findAll(collection);
    return authors.data;
};

const findAuthor = async (authorId) => {
    const results = await db.find(collection, { _id: authorId });
    if (Array.isArray(results.data) && results.data.length === 0)
        return { success: false, errors: 'Author not found' };
    return results;
};

const createAuthor = async (author) => {
    const authorToSave = { ...authorStructure, ...author };
    authorToSave._id = uuid.v1();
    const results = await db.insert(collection, authorToSave);
    if (results.success) results.msg = 'Author created';
    return results;
};

const deleteAuthor = async (authorId) => {
    let results = false;
    const filter = { _id: authorId };
    const author = await db.find(collection, filter);
    if (Array.isArray(author.data) && author.data.length > 0) {
        if (author.data[0].articles && author.data[0].articles.length > 0) {
            await db.removeAll('articles', author.data[0].articles);
        }
        results = await db.remove(collection, filter);
        return results;
    }
    return { success: false, errors: 'author not found' };
};

const updateAuthor = async (authorId, newValues) => {
    const filter = { _id: authorId };
    const author = await db.find(collection, filter);
    if (Array.isArray(author.data) && author.data.length > 0) {
        const fieldsToUpdate = { ...authorStructure, ...newValues };
        delete fieldsToUpdate.id;
        const results = await db.update(collection, {
            filters: filter,
            newValues: fieldsToUpdate,
        });
        if (results.success) results.msg = 'Author updated';
        return results;
    }
    return { success: false, errors: 'Author not found' };
};

module.exports = (config) => {
    db = config.db;
    return {
        getAuthors,
        findAuthor,
        createAuthor,
        deleteAuthor,
        updateAuthor,
    };
};
