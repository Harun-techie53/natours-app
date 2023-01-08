const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const { findById } = require('../models/tourModel');
const factoryController = require('./handleFactoryController');
const APIFeatures = require('../utils/apiFeatures');

exports.getUsers = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(User.find().select('-password'), req.query).filter().sort().paginate();
    const users = await features.query;
    res.status(200).json({
        status: 'success',
        result: users.length,
        data: {
            users
        }
    });
});

exports.getUser = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.params.id).select('-password');
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.getCurrentUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route isn\'t for password update!', 403));
    }

    const user = await User.findByIdAndUpdate(
        req.user.id,
        req.body,
        { 
            new: true,
            runValidators: true 
        }
    ).select('-password');
    
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

const filteredFields = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.updateUser = catchAsync(async (req, res, next) => {
    const filterObj = filteredFields(req.body, 'name', 'email');

    const user = await User.findByIdAndUpdate(
        req.params.id,
        filterObj,
        {
            new: true,
            runValidators: true
        }
    ).select('-password');

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndRemove(req.user.id);

    res.status(204).json({
        status: 'success',
        message: 'User deleted successfully!'
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    await User.findByIdAndRemove(req.params.id);
    res.status(204).json({
        status: 'success',
        message: 'User deleted successfully!'
    });
});