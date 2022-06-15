const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use('/api/v1/tours', require('./routes/tourRoute'));

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true
}).then((con) => {
    console.log('Database connected!');
});

const {PORT} = process.env;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}...`);
});