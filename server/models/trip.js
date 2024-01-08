const mongoose = require('mongoose')

const TripSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
        location: {type: String, required: false},
        length: {type: String, required: false},
        date: {type: String, required: true},
        rating: {type: Number, required: false},
        userId: {type: String, required: true},
        username: {type: String, required: true},
        images: [String],
    },
    { collection: 'trips', timestamps: true }
)

const model = mongoose.model('TripSchema', TripSchema)
module.exports = model