const User = require('../models/user');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { username, email, password: plainPassword } = req.body;
    // Add a library to do more checks for password/username/email length/username format
    if (!username || !email || !plainPassword) return res.status(400).json({ 'message': 'Username, email and password are required.' });

    const isDuplicate = await User.findOne({ username }).exec();
    if (isDuplicate) return res.sendStatus(409);

    try {
        const password = await bcrypt.hash(plainPassword, 10);
        const result = await User.create({
            username,
            email,
            password,
        });

        console.log(result);

        res.status(201).json({ 'success': `New user: ${username} is created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };