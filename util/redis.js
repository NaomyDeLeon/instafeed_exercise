const redisClient = require('redis');

const getClient = (redisURL) => {
    try {
        return redisClient.createClient({ url: redisURL });
    } catch (err) {
        console.log(err);
        return undefined;
    }
};

module.exports = (redisURL) => {
    return getClient(redisURL);
};
