const origin = process.env.origin || 'http:127.0.0.1';
const port = process.env.PORT || 8080;
const articlesPath = process.env.ARTICLES_PATH || '/articles';
const authorsPath = process.env.AUTHORS_PATH || '/authors';
const usersPath = process.env.AUTHORS_PATH || '/users';
const sessionsPath = process.env.AUTHORS_PATH || '/sessions';
const mongoUser = process.env.MONGO_USER || 'instafeedclient';
const mongoPwd = process.env.MONGO_PWD || escape('D.vX#naGq6aMxEy');
const mongoDb = process.env.MONGO_DB || 'instafeed';
const mongoCluster =
    process.env.MONGO_CLUSTER || 'instafeed-cluster.4xcj3.mongodb.net';

module.exports = {
    origin,
    port,
    articlesPath,
    authorsPath,
    usersPath,
    sessionsPath,
    mongoUser,
    mongoPwd,
    mongoCluster,
    mongoDb,
};
