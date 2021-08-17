const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./configs/default');

const corsOptions = {
    origin: [config.origin],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
};

const dbManager = require('./util/mongo')({
    user: config.mongoUser,
    password: config.mongoPwd,
    cluster: config.mongoCluster,
    database: config.mongoDb,
});

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

const { port } = config;
const { articlesPath } = config;
const { authorsPath } = config;
const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(articlesPath, articleRouter);
app.use(authorsPath, authorRouter);

dbManager
    .run()
    .then(() => app.listen(port, () => console.log('server iniciado')))
    .catch((err) => console.error(err));
