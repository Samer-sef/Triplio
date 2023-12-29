const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const cookies = req.cookies;

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if(!match) return res.sendStatus(401);

    const roles = Object.values(foundUser.roles).filter(Boolean);
    const username = foundUser.username
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": foundUser.email,
                "roles": roles,
            }
        },
        process.env.JWT_TOKEN_KEY,
        { expiresIn: '24h' }
    );
    const newRefreshToken = jwt.sign(
        { "email": foundUser.email },
        process.env.JWT_REFRESH_TOKEN_KEY,
        { expiresIn: '14d' }
    );

    let newRefreshTokenArray =
        !cookies?.jwt
            ? foundUser.refreshToken
            : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

    // Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();

    res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 20 * 24 * 60 * 60 * 1000 });
    res.json({ accessToken, username });
}

module.exports = { handleLogin };