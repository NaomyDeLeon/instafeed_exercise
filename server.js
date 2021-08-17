const { cpus } = require('os');
const cluster = require('cluster');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const redis = require('redis');
const config = require('./configs/default');
const passwordManager = require('./util/passwordManager');

const corsOptions = config.corsConfig;
const apiLogger = require('./middlewares/apiLogger');
const dbManager = require('./util/mongo')(config.defaultMongoURI);

const redisClient = redis.createClient({ url: config.defaultRedisURL });

const articleEvents = require('./events/articleEventsManager')(redisClient);

const { tokenValidator } = require('./middlewares/security')(
    config.tokenSign,
    apiLogger.responseLogger
);

const articleSchemaRules = require('./schema-rules/articleSchemaRules');
const { articleYupValidationHandler } =
    require('./schema-validators/articleValidators')(articleSchemaRules);
const articleManager = require('./managers/articleManager')(
    dbManager,
    articleEvents
);
const articleRouter = require('./routers/articleRouter')(
    express.Router(),
    articleManager,
    articleYupValidationHandler,
    apiLogger.responseLogger,
    redisClient
);

const authorSchemaRules = require('./schema-rules/authorSchemaRules');
const { authorYupValidationHandler } =
    require('./schema-validators/authorValidators')(authorSchemaRules);
const authorManager = require('./managers/authorManager')(dbManager);
const authorRouter = require('./routers/authorRouter')(
    express.Router(),
    authorManager,
    authorYupValidationHandler,
    apiLogger.responseLogger
);

const userSchemaRules = require('./schema-rules/userSchemaRules');
const { userYupValidationHandler } =
    require('./schema-validators/userValidators')(userSchemaRules);
const userManager = require('./managers/userManager')(
    dbManager,
    passwordManager
);
const userRouter = require('./routers/userRouter')(
    express.Router(),
    userManager,
    userYupValidationHandler,
    apiLogger.responseLogger
);

const sessionSchemaRules = require('./schema-rules/sessionSchemaRules');
const { sessionYupValidationHandler } =
    require('./schema-validators/sessionValidators')(sessionSchemaRules);
const sessionManager = require('./managers/sessionManager')(
    dbManager,
    passwordManager,
    config.tokenSign
);
const sessionRouter = require('./routers/sessionRouter')(
    express.Router(),
    sessionManager,
    sessionYupValidationHandler,
    apiLogger.responseLogger
);

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
        dbManager
            .run()
            .then(() => app.listen(config.port, () => console.log('iniciado')))
            .catch((err) => console.error(err));
        console.log(`Worker ${process.pid} started`);
    }
} catch (err) {
    console.error(err);
}
