const Trip = require('../models/trip');


const CreateTrip = async (req, res) => {
    const { name, description, location, length, date, rating, userEmail } = req.body

    // if (!name || !description || !location || !length || !date || !date || !rating) {
    //     return res.status(400).json({ message: 'All fields are required' })
    // }

    const trip = await Trip.create({ name, description, location, length, date, rating, userEmail })

    if (trip) {
        return res.status(201).json({ message: 'New trip created' })
    } else {
        return res.status(400).json({ message: 'Invalid trip data received' })
    }
}


const GetAllTrips = async (req, res) => {
    try {
        const skip = req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0

        const trips = await Trip.find({}, undefined, { skip, limit: 5 }) //TODO:: Make limit env var.

        if (!trips?.length) {
            return res.status(400).json({ message: 'No trips found' })
        }

        res.status(200).send(trips)

    } catch (e) {
        return res.status(400).json({ message: 'Invalid args received' })
    }
}


const UpdateTrip = async (req, res) => {
    const { name, description, location, length, date, rating, id, userEmail } = req.body

    // if (!name || !description || !location || !length || !date || !date || !rating) {
    //     return res.status(400).json({ message: 'All fields are required' })
    // }

    const trip = await Trip.findById(id).exec()

    if (!trip) {
        return res.status(400).json({ message: 'Trip was not found' })
    }

    note.name = name || note.name
    note.description = description || note.description
    note.text = text || note.text
    note.location = location || note.location
    note.length = length || note.length
    note.date = date || note.date
    note.rating = rating || note.rating
    note.userEmail = rating || note.userEmail

    const updatedTrip = await note.save()

    res.status(200).json(`'${updatedTrip.name}' updated`)
}


const DeleteTrip = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Trip ID is required' })
    }

    const trip = await Trip.findById(id).exec()

    if (!trip) {
        return res.status(400).json({ message: 'Trip was not found' })
    }

    const result = await trip.deleteOne()

    res.status(200).json(`Trip '${result.name}' with ID ${result._id} was deleted`)
}


module.exports = {
    CreateTrip,
    GetAllTrips,
    UpdateTrip,
    DeleteTrip,
}