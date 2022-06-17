const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const tourRouter = require('./routes/tourRoute');

const app = express();

app.use(express.json());

app.use('/api/v1/tours', tourRouter);

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