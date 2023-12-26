const User = require('../models/user');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users were found' });
    res.json(users);
}

const deleteUser = async (req, res) => {
    const { id } = req.body.id
    if (!id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${id} was not found` });
    }
    const result = await user.deleteOne({ _id: id });
    res.json(result);
}

const getUser = async (req, res) => {
    const { id } = req.body.id
    if (!id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${id} not found` });
    }
    res.json(user);
}

module.exports = {
    getAllUsers,
    deleteUser,
    getUser
}