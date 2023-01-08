require('dotenv').config();
const connectDB = require('./config/db');

//Caught the error due to uncaught promise rejection
process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    process.exit(1);
});

//Initialize express app
const app = require('./app');

connectDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}...`);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    process.exit(1);
});