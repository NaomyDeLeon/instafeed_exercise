const uuid = require('uuid');

let dbManager;
let passwordManager;

const collection = 'users';
const userStructure = {
    username: undefined,
    password: undefined,
    role: undefined,
};

const getUsers = async () => {
    const users = await dbManager.findAll(collection);
    users.data = users.data.map((user) => {
        return { id: user._id, username: user.username, role: user.role };
    });
    return users.data;
};

const findUser = async (userId) => {
    const results = await dbManager.find(collection, { _id: userId });
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
    const results = await dbManager.insert(collection, userToSave);
    if (results.success) results.msg = 'User created';
    return results;
};

const deleteUser = async (userId) => {
    let results = false;
    const filter = { _id: userId };
    const user = await dbManager.find(collection, filter);
    if (Array.isArray(user.data) && user.data.length > 0) {
        results = await dbManager.remove(collection, filter);
        return results;
    }
    return { success: false, errors: 'user not found' };
};

module.exports = (injectedDbManager, injectedPasswordManager) => {
    dbManager = injectedDbManager;
    passwordManager = injectedPasswordManager;
    return {
        getUsers,
        findUser,
        createUser,
        deleteUser,
    };
};
