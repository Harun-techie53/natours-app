const mongoose = require('mongoose');

const DB = process.env.DATABASE_REMOTE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

module.exports = connectDB = () => mongoose.connect(DB, {
    useNewUrlParser: true
}).then((con) => {
    console.log('Database connected!');
}).catch((err) => console.log(err.message));

