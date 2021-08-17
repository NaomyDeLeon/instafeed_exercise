let dbManager;
const collection = 'articles';
const articleStructure = {
    id: undefined,
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
    if (Array.isArray(articles) && articles.length === 0) return [];
    return articles;
};

const findArticle = async (articleId) => {
    const results = await dbManager.find(collection, { id: articleId });
    if (Array.isArray(results) && results.length === 0) return undefined;
    return results;
};

const createArticle = async (article) => {
    const author = await dbManager.find('authors', { id: article.author });
    let result = false;
    if (Array.isArray(author) && author.length > 0) {
        result = await dbManager.insert(collection, article);
    } else {
        return { created: result, errors: 'author does not exist' };
    }
    return { created: result };
};

const deleteArticle = async (articleId) => {
    const filter = { id: articleId };
    const results = await dbManager.remove(collection, filter);
    return results;
};

const updateArticle = async (articleId, article) => {
    const filter = { id: articleId };
    const fieldsToUpdate = { ...articleStructure, ...article };
    delete fieldsToUpdate.id;
    const results = await dbManager.update(collection, filter, fieldsToUpdate);
    return results;
};

const updateArticlePartially = async (articleId, article) => {
    const filter = { id: articleId };
    const fieldsToUpdate = article;
    if (fieldsToUpdate.hasOwnProperty('id')) {
        delete fieldsToUpdate.id;
    }
    const results = await dbManager.update(collection, filter, fieldsToUpdate);
    return results;
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
