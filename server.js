const express = require('express');
const dbManager = require('./util/mongo');

const { articleYupValidationHandler } = require('./articles/articleValidators');
const articleManager = require('./articles/articleManager')(dbManager);
const articleRouter = require('./articles/articleRouter')(
    express.Router(),
    articleManager,
    articleYupValidationHandler
);

const { authorYupValidationHandler } = require('./authors/authorValidators');
const authorManager = require('./authors/authorManager')(dbManager);
const authorRouter = require('./authors/authorRouter')(
    express.Router(),
    authorManager,
    authorYupValidationHandler
);

const app = express();
const defaultPort = 8081;
const articlesPath = '/articles';
const authorsPath = '/authors';

app.use(express.json());
app.use(articlesPath, articleRouter);
app.use(authorsPath, authorRouter);

dbManager
    .run()
    .then(() => app.listen(defaultPort, () => console.log('server iniciado')))
    .catch((err) => console.error(err));
