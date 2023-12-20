const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose')

require("dotenv").config();

app.use(require('./routes'));


const connect_to_db = async () => {
    try {
        const db_url = process.env.MONGO_DB_URI
        await mongoose.connect(db_url)
        console.log('Connected to db!')
    } catch (error) {
        console.log(error)
    }
}
connect_to_db()

const port = process.env.PORT || 5000;
const address = process.env.SERVER_ADDRESS || "127.0.0.1";
app.listen(port, address, () => console.log('Server started!'))