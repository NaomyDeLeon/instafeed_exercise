const http = require('http');
const fs = require('fs');

const defaultPort = 8080;
const articlesUrl = '/articles';
const singleArticleUrl = /(articles\/[a-z0-9-]{36})/;
const dbPath = './db.json';
let articlesDb;
const loadArticlesDb = async () => {
    articlesDb = await fs.promises
        .readFile(dbPath)
        .then((articles) => JSON.parse(articles))
        .finally(() => console.log('database loaded'))
        .catch((err) => console.info(err));
};

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'GET') {
        if (req.url === articlesUrl) {
            if (articlesDb !== undefined) {
                res.statusCode = 200;
                res.write(JSON.stringify(articlesDb));
                res.end();
            } else {
                res.statusCode = 200;
                res.write('unavailable retry in few minutes');
                res.end();
            }
        } else if (singleArticleUrl.test(req.url)) {
            if (articlesDb !== undefined) {
                const articleId = req.url.split('/')[2];
                console.log(articleId);
                const articleJson = articlesDb.filter(
                    (article) => article.id === articleId
                );
                res.statusCode = 200;
                res.write(JSON.stringify(articleJson));
                res.end();
            } else {
                res.statusCode = 200;
                res.write('unavailable retry in few minutes');
                res.end();
            }
        } else {
            res.statusCode = 404;
            res.write('invalid method');
            res.end();
        }
    }
});
server.listen(defaultPort, () => console.log('servidor iniciado'));
loadArticlesDb();
