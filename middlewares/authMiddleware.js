const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

exports.protectRoute = catchAsync(async (req, res, next) => {
    let token;

    // Check to see whether token available or not
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if(!token) {
        return next(new AppError('No token, authorization denied!', 401));
    }
    // Verification the token
    let decoded;

    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    if(!decoded) {
        return next(new AppError('Token is not valid, authorization denied!', 401));
    }

    const freshUser = await User.findById(decoded.id);

    // If the user does not exist after the token is issued
    if(!freshUser) {
        return next(new AppError('The user belonging this token does not exist anymore!', 404));
    }

    req.user = freshUser;

    next();
});

exports.restrictTo = (...roles) => catchAsync(async(req, res, next) => {
    if(!roles.includes(req.user.role)) {
        return next(new AppError('Permission denied!', 403));
    }

    next();
})