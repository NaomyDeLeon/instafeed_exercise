const events = require('events');

const event = new events.EventEmitter();

module.exports = (redis) => {
    event.on('ArticleCreated', (article) => {
        redis.set(`article-${article.data._id}`, JSON.stringify(article.data));
        redis.expire(`article-${article.data._id}`, 60 * 60);
    });
    return event;
};
