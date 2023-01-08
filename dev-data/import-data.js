require('dotenv').config();
const Tour = require('../models/tourModel');
const fs = require('fs');
const connectDB = require('../config/db');

//Database connection
connectDB();

//Read the data from file system
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data is successfully imported!');
        process.exit();
    } catch (err) {
        console.log(err.message);
    }
}

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data is successfully deleted!');
        process.exit();
    } catch (err) {
        console.log(err.message);
    }
}


if(process.argv[2] === '--import') {
    importData();
} else if(process.argv[2] === '--delete') {
    deleteData();
}