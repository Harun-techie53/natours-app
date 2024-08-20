const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().paginate().fields();
    const tours = await features.query;

    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            tours
        }
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = new APIFeatures(Tour.findById(req.params.id).populate('reviews'), req.query).fields();

    if(!tour) {
        const err = new AppError("Tour not found!", 404);

        return next(err);
    }
    
    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { price: { $gte: 1197 } }
        },
        {
            $group: {
                _id: '$difficulty',
                numTours: { $sum: 1 },
                numRatingsQuantity: { $sum: '$ratingsQuantity' },
                avgRatingsAverage: { $avg: '$ratingsAverage' },
                avgRatingsQuantity: { $avg: '$ratingsQuantity' }
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
})

exports.createTour = catchAsync(async (req, res, next) => {
    const { 
        name, 
        price,
        duration,
        maxGroupSize,
        startDates,
        imageCover,
        difficulty,
        ratingsAverage,
        ratingsQuantity,
        summary,
        description,
        images,
        guides
    } = req.body;

    const tour = new Tour({
        name, 
        price,
        duration,
        maxGroupSize,
        startDates,
        imageCover,
        difficulty,
        ratingsAverage,
        ratingsQuantity,
        summary,
        description,
        images,
        guides
    });

    await tour.save();

    res.status(201).json({
        status: 'success',
        data: {
            tour
        }
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(
        req.params.id,
        req.body,
        { 
            new: true,
            runValidators: true 
        }
    );

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    await Tour.findByIdAndRemove(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});