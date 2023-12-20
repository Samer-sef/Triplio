const User = require('../models/user')
const {generateAccessToken, generateRefreshToken} = require('../util/jwt_helpers')
const bcrypt = require('bcryptjs')


const register = async (req, res) => {
    const {email, username, password: plain_password} = req.body

    //TODO: look for a library that does these kind of checks...
    if (!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: 'Invalid username' })
    }

    if (!email || typeof email !== 'string') {
        return res.json({ status: 'error', error: 'Invalid username' })
    }

    if (!plain_password || typeof plain_password !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' })
    }

    if (plain_password.length < 5) {
        return res.json({
            status: 'error',
            error: 'Password too short. Should be atleast 6 characters'
        })
    }

    const password = await bcrypt.hash(plain_password, 10)

    try {
        temp_user = {...req.body, is_admin: false}
        const access_token = generateAccessToken(temp_user);
        const refresh_token = generateRefreshToken(temp_user);
        const user = await User.create({
            email,
            username,
            password,
            refresh_token,
        })
        console.log('User created successfully: ', user)
        if(!user){
            return res.status(400).json("Username or password incorrect!")
        }
        return res.status(200).json({
            username: user.username,
            isAdmin: user.is_admin,
            access_token,
            refresh_token,
        });
    } catch (error) {
        if (error.code === 11000) {
            // 11000 = duplicate key
            return res.json({ status: 'error', error: 'Username already in use' })
        }
        throw error
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    //TODO:: check if there's a method to findAndUpdate?
    const user = await User.findOne({ email }).lean()
    if(!user || !await bcrypt.compare(password, user.password)){
        return res.status(400).json('Email or password incorrect!');
    }
    const access_token = generateAccessToken(user);
    const refresh_token = generateRefreshToken(user);

    //save refresh_token to the db
    username = user.username
    await User.updateOne(
        { username },
        {
            $set: { refresh_token }
        }
    )

    return res.status(200).json({
        username: user.username,
        isAdmin: user.is_admin,
        access_token,
        refresh_token,
    });
}


module.exports = {
    register,
    login,
  }