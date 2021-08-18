const cluster = require('cluster');
const { cpus } = require('os');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const redisClient = require('redis');
const swaggerUi = require('swagger-ui-express');
const config = require('./configs/default');
const swaggerDocument = require('./swagger.json');
const apiLogger = require('./api/middlewares/apiLogger');
const passwordManager = require('./util/passwordManager')(config.tokenSign);
const db = require('./util/mongo')(config.defaultMongoURI);

const redis = redisClient.createClient({ url: config.defaultRedisURL });

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

try {
    const numCPUs = cpus().length;
    if (cluster.isMaster) {
        console.log(`Primary ${process.pid} is running`);
        for (let i = 0; i < numCPUs; i += 1) {
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log(
                `worker ${worker.process.pid} died ${code} - ${signal}`
            );
        });
    } else {
        db.run()
            .then(() => app.listen(config.port, () => console.log('iniciado')))
            .catch((err) => console.error(err));
        console.log(`Worker ${process.pid} started`);
    }
} catch (err) {
    console.error(err);
}
