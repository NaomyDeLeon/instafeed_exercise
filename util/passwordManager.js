const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let sign;
const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

const validatePassword = async (password, hashedPassword) => {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
};

const getUserToken = (tokenData) =>
    jwt.sign(tokenData, sign, { expiresIn: 60 * 60 });

module.exports = (tokenSign) => {
    sign = tokenSign;
    return {
        encryptPassword,
        validatePassword,
        getUserToken,
    };
};
