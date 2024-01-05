const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleNewUser = async (req, res) => {
    const { username, email, password: plainPassword } = req.body;
    // Add a library to do more checks for password/username/email length/username format
    if (!username || !email || !plainPassword) return res.status(400).json({ 'message': 'Username, email and password are required.' });

    const isDuplicate = await User.findOne({ email }).exec();
    if (isDuplicate) return res.sendStatus(409);

    try {
        const newRefreshToken = jwt.sign(
            { email },
            process.env.JWT_REFRESH_TOKEN_KEY,
            { expiresIn: '14d' }
        );

        const password = await bcrypt.hash(plainPassword, 10);
        const createdUser = await User.create({
            username,
            email,
            password,
            refreshToken: [ newRefreshToken ],
        });

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    email,
                    "roles": createdUser.roles,
                }
            },
            process.env.JWT_TOKEN_KEY,
            { expiresIn: '24h' }
        );

        console.log(createdUser);
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 20 * 24 * 60 * 60 * 1000 });
        res.json({ accessToken, username, email });
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };