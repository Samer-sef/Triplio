const jwt = require('jsonwebtoken');
const User = require('../models/user')
const {generateAccessToken, generateRefreshToken} = require('../util/jwt_helpers')


const refresh = async (req, res) => {
    const incoming_refresh_token = req.body.token;

    if (!incoming_refresh_token) return res.status(401).json('You are not authenticated.');

    jwt.verify(incoming_refresh_token, process.env.JWT_REFRESH_TOKEN_KEY, async (err, user) => {
        if(err){
            console.log(err);
            return res.status(403).json('Token is not valid.');
        }
        const username = user.username

        // Make sure the user who is calling the API has a valid refresh_token that belongs to him/her
        const user_db = await User.findOne({ username }).lean()
        if(!user_db){
            return res.status(400).json('Account not found.');
        }
        if(user_db.refresh_token != incoming_refresh_token){
            return res.status(400).json('Token is not valid.');
        }

        const access_token = generateAccessToken(user);
        const refresh_token = generateRefreshToken(user);

        //save the new refresh_token to the db
        await User.updateOne(
            { username },
            {
                $set: { refresh_token }
            }
        )

        return res.status(200).json({
            access_token: access_token,
            refresh_token: refresh_token,
        });
    });
};


const verify = (req, res, next) => {
    //Use this later for new APIS
    const auth_header = req.headers.authorization;
    if(!auth_header){
        res.status(401).json('You are not authenticated!');
    }
    //remove 'Bearer'
    const token = auth_header.split(" ")[1];

    jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, user) => {
        if (err) {
            return res.status(403).json('Token is not valid.');
        }

        req.user = user;
        next();
    });
};



module.exports = {
    refresh,
    verify,
  }