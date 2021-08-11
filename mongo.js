const { MongoClient } = require('mongodb');

const USER = 'instafeedclient';
const PASSWORD = escape('D.vX#naGq6aMxEy');
const CLUSTER = 'instafeed-cluster.4xcj3.mongodb.net';
const DATABASE = 'instafeed';

const uri = `mongodb+srv://${USER}:${PASSWORD}@${CLUSTER}/${DATABASE}?writeConcern=majority&retryWrites=true`;
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        await client.db(DATABASE).command({ ping: 1 });
        console.log('Connected successfully to server');
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

const execute = async (operation) => {
    let result;
    try {
        await client.connect();
        result = await operation();
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
    return result;
};
const insert = async (collection, object) => {
    let result = false;
    result = await execute(
        () =>
            new Promise((resolve) =>
                client
                    .db(DATABASE)
                    .collection(collection)
                    .insertOne(object, async (err, res) => {
                        if (err) throw err;
                        console.log(res);
                        resolve(true);
                    })
            )
    );
    return result;
};

const findAll = async (collection) => {
    let result = [];
    result = await execute(() =>
        client.db(DATABASE).collection(collection).find({}).toArray()
    );
    return result;
};

const find = async (collection, filters) => {
    let result = [];
    result = await execute(() =>
        client.db(DATABASE).collection(collection).find(filters).toArray()
    );
    return result;
};

module.exports = {
    run,
    insert,
    find,
    findAll,
};
