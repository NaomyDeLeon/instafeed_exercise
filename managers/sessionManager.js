const jwt = require('jsonwebtoken');

const collection = 'users';
let localDbManager;
let localPasswordManager;
let localTokenSign;

const createUserToken = async (loginData) => {
    const { username } = loginData;
    const { password } = loginData;
    const results = await localDbManager.find(collection, { username });
    if (Array.isArray(results.data) && results.data.length === 0)
        return { success: false, errors: 'User not found' };
    const user = results.data[0];
    const hashedPassword = user.password;
    const isValid = await localPasswordManager.validatePassword(
        password,
        hashedPassword
    );
    if (isValid) {
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            localTokenSign,
            { expiresIn: 60 * 60 }
        );
        return { success: true, data: token };
    }
    return { success: false, errors: 'invalid password' };
};

module.exports = (dbManager, passwordManager, tokenSign) => {
    localDbManager = dbManager;
    localPasswordManager = passwordManager;
    localTokenSign = tokenSign;
    return {
        createUserToken,
    };
};
