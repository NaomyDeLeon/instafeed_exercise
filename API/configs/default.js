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
    'redis://:pfc5464b293b6b7a81e5752c352ffa006f288803ff2556c32f6eec1b0d288ab6a@ec2-44-195-240-40.compute-1.amazonaws.com:16529';
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
