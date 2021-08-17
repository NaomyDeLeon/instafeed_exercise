const collection = 'users';
let db;
let passwordManager;

const createUserToken = async (loginData) => {
    const { username } = loginData;
    const { password } = loginData;
    const results = await db.find(collection, { username });
    if (Array.isArray(results.data) && results.data.length === 0)
        return { success: false, errors: 'User not found' };
    const user = results.data[0];
    const hashedPassword = user.password;
    const isValid = await passwordManager.validatePassword(
        password,
        hashedPassword
    );
    if (isValid) {
        const token = passwordManager.getUserToken({
            id: user._id,
            username: user.username,
            role: user.role,
        });
        return { success: true, data: token };
    }
    return { success: false, errors: 'invalid password' };
};

module.exports = (config) => {
    db = config.db;
    passwordManager = config.passwordManager;
    return {
        createUserToken,
    };
};
