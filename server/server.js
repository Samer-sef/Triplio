const express = require('express');
const app = express();
const mongoose = require('mongoose')
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');


require("dotenv").config()

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false })) //to handle urlencoded form data
app.use(express.json())
app.use(cookieParser())
app.use(require('./routes'))
app.use(errorHandler)


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

//TODO:: run the server AFTER db connection is successful
const port = process.env.PORT || 5000
const address = process.env.SERVER_ADDRESS || "127.0.0.1"
app.listen(port, address, () => console.log('Server started!'))