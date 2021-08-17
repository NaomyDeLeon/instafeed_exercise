let db;
let events;
const collection = 'articles';
const authorCollection = 'authors';
const articleStructure = {
    _id: undefined,
    title: undefined,
    modifiedAt: undefined,
    publishedAt: undefined,
    keywords: undefined,
    author: undefined,
    readMins: undefined,
    source: undefined,
    url: undefined,
};

const getArticles = async () => {
    const articles = await db.findAll(collection);
    if (Array.isArray(articles.data) && articles.data.length === 0) return [];
    return articles.data;
};

const findArticle = async (articleId) => {
    const results = await db.find(collection, { _id: articleId });
    if (Array.isArray(results.data) && results.data.length === 0)
        return { success: false, errors: 'Article not found' };
    return results;
};

const createArticle = async (article) => {
    const author = await db.find(authorCollection, {
        _id: article.author,
    });
    if (Array.isArray(author.data) && author.data.length > 0) {
        const fieldsToInsert = { ...articleStructure, ...article };
        fieldsToInsert._id = fieldsToInsert.id;
        delete fieldsToInsert.id;
        const newArticle = { articles: fieldsToInsert._id };
        const result = await db.insert(collection, fieldsToInsert);
        if (result.success) {
            events.emit('ArticleCreated', { data: fieldsToInsert });
            await db.update(authorCollection, {
                filters: author.data[0],
                add: newArticle,
            });
        }
        return result;
    }
    return { created: false, errors: 'Author does not exist' };
};

const deleteArticle = async (articleId) => {
    const filter = { _id: articleId };
    const article = await db.find(collection, filter);
    if (Array.isArray(article.data) && article.data.length > 0) {
        const author = await db.find(authorCollection, {
            _id: article.data[0].author,
        });
        const toUpdate = { articles: articleId };
        await db.update(authorCollection, {
            filters: author.data[0],
            pull: toUpdate,
        });
        const results = await db.remove(collection, filter);
        return results;
    }
    return { success: false, errors: 'Article not found' };
};

const updateArticle = async (articleId, newValues) => {
    const filter = { _id: articleId };
    const article = await db.find(collection, filter);
    if (Array.isArray(article.data) && article.data.length > 0) {
        const fieldsToUpdate = { ...articleStructure, ...newValues };
        delete fieldsToUpdate.id;
        const results = await db.update(collection, {
            filters: filter,
            newValues: fieldsToUpdate,
        });
        return results;
    }
    return { success: false, errors: 'Article not found' };
};

const updateArticlePartially = async (articleId, newValues) => {
    const filter = { _id: articleId };
    const article = await db.find(collection, filter);
    if (Array.isArray(article.data) && article.data.length > 0) {
        const fieldsToUpdate = newValues;
        if (fieldsToUpdate.hasOwnProperty('id')) {
            delete fieldsToUpdate.id;
        }
        const results = await db.update(collection, {
            filters: filter,
            newValues: fieldsToUpdate,
        });
        return results;
    }
    return { success: false, errors: 'Article not found' };
};

module.exports = (config) => {
    db = config.db;
    events = config.events;
    return {
        getArticles,
        findArticle,
        createArticle,
        deleteArticle,
        updateArticle,
        updateArticlePartially,
    };
};
