const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        is_admin: {type: Boolean, default: false},
        refresh_token: {type: String, required: true, unique: true},
    },
    { collection: 'users' }
)

const model = mongoose.model('UserSchema', UserSchema)
module.exports = model