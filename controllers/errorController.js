const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
    const message = new AppError(`Invalid ${err.path}: ${err.value}`, 400);

    return message;
}

const handleDuplicateFieldValueErrorDB = (err) => {
    const value = err.keyValue.name;
    const message = new AppError(`Duplicate value: \'${value}'\ detect!`, 400);

    return message;
}

const handleValidationErrorDB = (err) => {
    // console.log(err.errors.map(()))
    const messages = Object.values(err.errors).map((err) => err.message);
    return new AppError(`Validation Error: ${messages.join('. ')}`, 400);
}

const sendErrorDev = (err, res) => {
    //Always send the exact error and its details in developemt mode
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        errorStack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    //Operaional errors or errors which occured client side
    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });

    //Programming errors or server side errors
    } else {
        //Log the error to find out what happen
        console.log(err);

        //Send to the client a generic error message
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! 💥'
        });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    //Development mode handle the errors
    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);

    //Production mode handle the errors
    } else if(process.env.NODE_ENV === 'production') {
        if(err.name === 'CastError') err = handleCastErrorDB(err);
        
        if(err.code === 11000) err = handleDuplicateFieldValueErrorDB(err);

        if(err.name === 'ValidationError') err = handleValidationErrorDB(err);
        
        sendErrorProd(err, res);
    }
}