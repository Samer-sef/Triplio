const User = require('../models/user');
const jwt = require('jsonwebtoken');


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();

    // Refresh token reuse detected
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN_KEY,
            async (err, decoded) => {
                if (err) return res.sendStatus(403); //Forbidden
                // Delete refresh tokens of hacked user
                const hackedUser = await User.findOne({ email: decoded.email }).exec();
                hackedUser.refreshToken = [];
                const result = await hackedUser.save();
            }
        )
        return res.sendStatus(403); //Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_KEY,
        async (err, decoded) => {
            if (err) {
                // expired refresh token
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
            }
            if (err || foundUser.email !== decoded.email) return res.sendStatus(403);

            // Refresh token was still valid
            const roles = Object.values(foundUser.roles);
            const username = foundUser.username
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": decoded.email,
                        "roles": roles
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

            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();

            res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 20 * 24 * 60 * 60 * 1000 });
            res.json({ accessToken, username })
        }
    );
}

module.exports = { handleRefreshToken }