let dbManager;
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
    const articles = await dbManager.findAll(collection);
    if (Array.isArray(articles.data) && articles.data.length === 0) return [];
    return articles.data;
};

const findArticle = async (articleId) => {
    const results = await dbManager.find(collection, { _id: articleId });
    if (Array.isArray(results.data) && results.data.length === 0)
        return { success: false, errors: 'Article not found' };
    return results;
};

const createArticle = async (article) => {
    const author = await dbManager.find(authorCollection, {
        _id: article.author,
    });
    if (Array.isArray(author.data) && author.data.length > 0) {
        const fieldsToInsert = { ...articleStructure, ...article };
        fieldsToInsert._id = fieldsToInsert.id;
        delete fieldsToInsert.id;
        const toUpdate = { articles: fieldsToInsert._id };
        const result = await dbManager.insert(collection, fieldsToInsert);
        await dbManager.update(
            authorCollection,
            author.data[0],
            undefined,
            toUpdate
        );
        return result;
    }
    return { created: false, errors: 'Author does not exist' };
};

const deleteArticle = async (articleId) => {
    const filter = { _id: articleId };
    const article = await dbManager.find(collection, filter);
    if (Array.isArray(article.data) && article.data.length > 0) {
        const author = await dbManager.find(authorCollection, {
            _id: article.data[0].author,
        });
        const toUpdate = { articles: articleId };
        await dbManager.update(
            authorCollection,
            author.data[0],
            undefined,
            undefined,
            toUpdate
        );
        const results = await dbManager.remove(collection, filter);
        return results;
    }
    return { success: false, errors: 'Article not found' };
};

const updateArticle = async (articleId, newValues) => {
    const filter = { _id: articleId };
    const article = await dbManager.find(collection, filter);
    if (Array.isArray(article.data) && article.data.length > 0) {
        const fieldsToUpdate = { ...articleStructure, ...newValues };
        delete fieldsToUpdate.id;
        const results = await dbManager.update(
            collection,
            filter,
            fieldsToUpdate
        );
        return results;
    }
    return { success: false, errors: 'Article not found' };
};

const updateArticlePartially = async (articleId, newValues) => {
    const filter = { _id: articleId };
    const article = await dbManager.find(collection, filter);
    if (Array.isArray(article.data) && article.data.length > 0) {
        const fieldsToUpdate = newValues;
        if (fieldsToUpdate.hasOwnProperty('id')) {
            delete fieldsToUpdate.id;
        }
        const results = await dbManager.update(
            collection,
            filter,
            fieldsToUpdate
        );
        return results;
    }
    return { success: false, errors: 'Article not found' };
};

module.exports = (injectedDbManager) => {
    dbManager = injectedDbManager;
    return {
        getArticles,
        findArticle,
        createArticle,
        deleteArticle,
        updateArticle,
        updateArticlePartially,
    };
};
