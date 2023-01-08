const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factoryController = require('./handleFactoryController');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllReivews = catchAsync(async (req, res, next) => {
    let filter = {};
    if(req.params.tourId) filter = { tour: req.params.tourId } ;

    const features = new APIFeatures(Review.find(filter), req.query).filter().sort().paginate().fields();
    const reviews = await features.query;
    res.status(200).json({
        status: 'success',
        result: reviews.length,
        data: {
            reviews
        }
    });
});

exports.getReview = catchAsync(async (req, res, next) => {
    let filter = { _id: req.params.id };

    if(req.params.tourId) filter = { $and: [ 
        { _id: req.params.id }, 
        { tour: req.params.tourId }
    ] };

    const review = await Review.find(filter);
    res.status(200).json({
        status: 'success',
        message: 'Get review route!',
        data: {
            review
        }
    });
});

exports.createReview = catchAsync(async (req, res, next) => {
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);

    res.status(200).json({
        status: 'success',
        message: 'Create review route!',
        data: {
            review: newReview
        }
    });
});

exports.updateReview = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'Update review route!'
    });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
    await Tour.findByIdAndRemove(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});
