const express = require('express');
const dbManager = require('./mongo');

const { articleYupValidationHandler } = require('./process');
const articleManager = require('./articleManager')(dbManager);
const articleRouter = require('./articleRouter')(
    express.Router(),
    articleManager,
    articleYupValidationHandler
);

const app = express();
const defaultPort = 8081;
const articlesPath = '/articles';

app.use(express.json());
app.use(articlesPath, articleRouter);

dbManager
    .run()
    .then(() => app.listen(defaultPort, () => console.log('server iniciado')))
    .catch((err) => console.error(err));
