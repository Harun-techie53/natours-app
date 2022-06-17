const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().paginate();
        const tours = await features.query;

        res.status(200).json({
            status: "success",
            result: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
}

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
}

exports.createTour = async (req, res) => {
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
        images
    } = req.body;
    try {
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
            images
        });
    
        await tour.save();
    
        res.status(201).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
}

exports.updateTour = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndRemove(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}