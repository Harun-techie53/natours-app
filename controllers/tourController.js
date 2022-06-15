const Tour = require('../models/tourModel');

exports.getTours = async (req, res) => {
    try {
        const tours = await Tour.find();
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
    const { name, rating, price } = req.body;
    try {
        const tour = new Tour({
            name,
            rating,
            price
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
    const newTour = new Tour(req.body);
    try {
        const tour = await Tour.findByIdAndUpdate(
            req.params.id,
            { $set: newTour },
            { new: true }
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