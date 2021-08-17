const origin = process.env.origin || 'http:127.0.0.1';
const port = process.env.PORT || 8080;
const articlesPath = process.env.ARTICLES_PATH || '/articles';
const authorsPath = process.env.AUTHORS_PATH || '/authors';
const usersPath = process.env.AUTHORS_PATH || '/users';
const sessionsPath = process.env.AUTHORS_PATH || '/sessions';
const crashPath = process.env.CRASH_PATH || '/crash';
const tokenSign = process.env.TOKEN_SIGN || 'welcome1';
const defaultRedisURL =
    process.env.DEFAULT_REDIS_URL ||
    'redis://:p0bba49d3a32583e43bd4bef3422faf0fe0b4a45cb554882985a46258613d28e2@ec2-50-19-125-212.compute-1.amazonaws.com:18139';
const defaultMongoURI =
    process.env.DEFAULT_MONGO_URL ||
    `mongodb+srv://instafeedclient:${escape(
        'D.vX#naGq6aMxEy'
    )}@instafeed-cluster.4xcj3.mongodb.net/instafeed?writeConcern=majority&retryWrites=true`;

const corsConfig = {
    origin: [origin],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
};

module.exports = {
    origin,
    port,
    articlesPath,
    authorsPath,
    usersPath,
    sessionsPath,
    crashPath,
    tokenSign,
    defaultRedisURL,
    defaultMongoURI,
    corsConfig,
};
