let dbManager;
const collectionName = 'articles';

const getArticles = async () => {
    const articles = await dbManager.findAll(collectionName);
    if (Array.isArray(articles) && articles.length === 0) return [];
    return articles;
};

const findArticle = async (articleId) => {
    const results = await dbManager.find(collectionName, { id: articleId });
    if (Array.isArray(results) && results.length === 0) return undefined;
    return results;
};

const createArticle = async (article) => {
    const results = await dbManager.insert(collectionName, article);
    return results;
};

module.exports = (injectedDbManager) => {
    dbManager = injectedDbManager;
    return {
        getArticles,
        findArticle,
        createArticle,
    };
};
