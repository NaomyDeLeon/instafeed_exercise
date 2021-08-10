const fs = require('fs');
const express = require('express');

const app = express();
const defaultPort = 8080;
const articlesPath = '/articles';
const singleArticlePath = '/articles/:id';
const dbPath = './db.json';
let articlesDb;

const loadArticlesDb = async () => {
    articlesDb = await fs.promises
        .readFile(dbPath)
        .then((articles) => JSON.parse(articles))
        .finally(() => console.log('database loaded'))
        .catch((err) => console.info(err));
};

const dbIsAvailable = () => articlesDb !== undefined;

loadArticlesDb();
app.use(express.json());
app.get(articlesPath, (req, res) => {
    if (dbIsAvailable) res.send(articlesDb);
    else res.send('unavailable retry in few minutes');
});
app.get(singleArticlePath, (req, res) => {
    const articleId = req.params.id;
    const articleJSON = articlesDb.filter(
        (article) => article.id === articleId
    );
    if (dbIsAvailable) res.send(articleJSON);
    else res.send('unavailable retry in few minutes');
});

app.listen(defaultPort, () => console.log('server iniciado'));
