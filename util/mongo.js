const { MongoClient } = require('mongodb');

let client;

const configureClient = (mongoURI) => {
    const uri = mongoURI;
    client = new MongoClient(uri);
};

async function run() {
    try {
        await client.connect();
        await client.db().command({ ping: 1 });
        console.log('Connected successfully to server');
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

const execute = async (operation) => {
    try {
        await client.connect();
        const result = await operation();
        return result;
    } catch (err) {
        console.error(err);
        return { success: false, errors: err };
    } finally {
        await client.close();
    }
};

const insert = async (collection, object) => {
    const result = await execute(() =>
        client
            .db()
            .collection(collection)
            .insertOne(object)
            .then((resp) => {
                return { success: true, id: resp.insertedId };
            })
            .catch((err) => {
                console.log(err);
                return { success: false, errors: err };
            })
    );
    return result;
};

const findAll = async (collection) => {
    const result = await execute(() =>
        client.db().collection(collection).find({}).toArray()
    );
    return { success: true, data: result };
};

const find = async (collection, filters) => {
    const result = await execute(() =>
        client.db().collection(collection).find(filters).toArray()
    );
    return { success: true, data: result };
};

const remove = async (collection, filters) => {
    const result = await execute(() =>
        client
            .db()
            .collection(collection)
            .deleteOne(filters)
            .then(() => {
                return { success: true };
            })
            .catch((err) => {
                console.log(err);
                return { success: false, errors: err };
            })
    );
    return result;
};

const removeAll = async (collection, ids) => {
    const toDelete = {};
    toDelete._id = { $in: ids };
    const result = await execute(() =>
        client
            .db()
            .collection(collection)
            .deleteMany(toDelete)
            .then(() => {
                return { success: true };
            })
            .catch((err) => {
                console.log(err);
                return { success: false, errors: err };
            })
    );
    return result;
};

const update = async (
    collection,
    filters,
    newValues = undefined,
    addToSet = undefined,
    pullFromSet = undefined
) => {
    const fieldsToUpdate = {};
    if (newValues) fieldsToUpdate.$set = newValues;
    if (addToSet) fieldsToUpdate.$addToSet = addToSet;
    if (pullFromSet) fieldsToUpdate.$pull = pullFromSet;
    const result = await execute(() =>
        client
            .db()
            .collection(collection)
            .updateOne(filters, fieldsToUpdate)
            .then(() => {
                return { success: true };
            })
            .catch((err) => {
                console.log(err);
                return { success: false, errors: err };
            })
    );
    return result;
};

module.exports = (mongoConfig) => {
    configureClient(mongoConfig);
    return {
        run,
        insert,
        find,
        findAll,
        remove,
        removeAll,
        update,
    };
};
