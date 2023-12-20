const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign({ username: user.username, isAdmin: user.isAdmin }, process.env.JWT_TOKEN_KEY, {
        expiresIn: "5s",
    });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ username: user.username, isAdmin: user.isAdmin }, process.env.JWT_REFRESH_TOKEN_KEY);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
  }
