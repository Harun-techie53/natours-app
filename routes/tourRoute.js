const express = require('express');
const router = express.Router();
const {
    getTours, 
    getTour, 
    createTour, 
    updateTour,
    deleteTour
} = require('../controllers/tourController');
const { tourAliasing } = require('../middlewares/tourMiddleware');

router
    .route('/')
    .get(getTours)
    .post(createTour);

router
    .route('/top-5-cheap')
    .get(tourAliasing, getTours);

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;