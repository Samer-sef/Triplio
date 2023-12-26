const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        refreshToken: [String],
        roles: {
            User: {type: Number, default: 123},
            Admin: {type: Number},
        },
    },
    { collection: 'users', timestamps: true }
)

const model = mongoose.model('UserSchema', UserSchema)
module.exports = model