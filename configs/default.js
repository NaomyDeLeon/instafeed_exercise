const origin = process.env.origin || 'http:127.0.0.1';
const port = process.env.PORT || 8080;
const articlesPath = process.env.ARTICLES_PATH || '/articles';
const authorsPath = process.env.AUTHORS_PATH || '/authors';
const usersPath = process.env.AUTHORS_PATH || '/users';
const sessionsPath = process.env.AUTHORS_PATH || '/sessions';
const tokenSign = process.env.TOKEN_SIGN || 'welcome1';
const defaultMongoURI =
    process.env.defaultMongoURI ||
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
    tokenSign,
    defaultMongoURI,
    corsConfig,
};
