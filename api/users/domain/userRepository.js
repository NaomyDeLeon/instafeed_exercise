const uuid = require('uuid');

const collection = 'users';
const userStructure = {
    username: undefined,
    password: undefined,
    role: undefined,
};

let db;
let passwordManager;

const getUsers = async () => {
    const users = await db.findAll(collection);
    users.data = users.data.map((user) => {
        return { id: user._id, username: user.username, role: user.role };
    });
    return users.data;
};

const findUser = async (userId) => {
    const results = await db.find(collection, { _id: userId });
    if (Array.isArray(results.data) && results.data.length === 0)
        return { success: false, errors: 'User not found' };
    results.data = results.data.map((user) => {
        return { id: user._id, username: user.username, role: user.role };
    });
    return results;
};

const createUser = async (user) => {
    const userToSave = { ...userStructure, ...user };
    userToSave._id = uuid.v1();
    userToSave.password = await passwordManager.encryptPassword(
        userToSave.password
    );
    const results = await db.insert(collection, userToSave);
    if (results.success) results.msg = 'User created';
    return results;
};

const deleteUser = async (userId) => {
    let results = false;
    const filter = { _id: userId };
    const user = await db.find(collection, filter);
    if (Array.isArray(user.data) && user.data.length > 0) {
        results = await db.remove(collection, filter);
        return results;
    }
    return { success: false, errors: 'user not found' };
};

module.exports = (config) => {
    db = config.db;
    passwordManager = config.passwordManager;
    return {
        getUsers,
        findUser,
        createUser,
        deleteUser,
    };
};
