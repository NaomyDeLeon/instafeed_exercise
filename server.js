const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const configManager = require('config');
const swaggerDocument = require('./swagger.json');
const apiLogger = require('./api/middlewares/apiLogger');

const config = configManager.get('env');
const passwordManager = require('./util/passwordManager')(config.tokenSign);
const db = require('./util/mongo')(config.defaultMongoURI);
const redis = require('./util/redis')(config.defaultRedisURL);

const { tokenValidator } = require('./api/middlewares/security')(
    config.tokenSign,
    apiLogger.responseLogger
);

const articleRouter = require('./api/articles/infrastucture/articleRouter')({
    router: express.Router(),
    logger: apiLogger.responseLogger,
    db,
    redis,
});

const authorRouter = require('./api/authors/infrastucture/authorRouter')({
    router: express.Router(),
    logger: apiLogger.responseLogger,
    db,
});

const userRouter = require('./api/users/infrastucture/userRouter')({
    router: express.Router(),
    logger: apiLogger.responseLogger,
    db,
    passwordManager,
});

const sessionRouter = require('./api/sessions/infrastucture/sessionRouter')({
    router: express.Router(),
    logger: apiLogger.responseLogger,
    db,
    passwordManager,
});

const corsOptions = config.corsConfig;
const app = express();
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(apiLogger.requestLogger);
app.use(tokenValidator);
app.use(config.articlesPath, articleRouter);
app.use(config.authorsPath, authorRouter);
app.use(config.usersPath, userRouter);
app.use(config.sessionsPath, sessionRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get(config.crashPath, () => process.exit(0));

module.exports = { app, db, config };
