const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet'); 
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const reviewRouter = require('./routes/reviewRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//Global Middlewares

//For setting up http headers
app.use(helmet());

//Development logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Too many requests limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

//Body parser 
app.use(express.json());

//Data sanitization against NoSql query injection
app.use(mongoSanitize());

//Data sanitization against xss attacks
app.use(xss());

//Serving Static files
app.use(express.static(`${__dirname}/public`));

//Prevent parameters pollution
app.use(hpp({
    whitelist: [
        'duration', 
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'price'
    ]
}));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//Undefined Routes Handler
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} in the server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;