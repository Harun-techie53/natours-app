const express = require('express');
const router = express.Router();
const {
    getTours, 
    getTour, 
    createTour, 
    updateTour,
    deleteTour,
    getTourStats
} = require('../controllers/tourController');
const { tourAliasing } = require('../middlewares/tourMiddleware');
const {protectRoute, restrictTo} = require('../middlewares/authMiddleware');
const reviewRouter = require('./reviewRoute');

//POST /:tourId/reviews
router.use('/:tourId/reviews', reviewRouter);

router
    .route('/')
    .get(getTours)
    .post(
        protectRoute, 
        restrictTo('admin', 'lead-guide', 'guide'),
        createTour
    );

router
    .route('/top-5-cheap')
    .get(tourAliasing, getTours);

router.route('/tour-stats').get(getTourStats);

router
    .route('/:id')
    .get(getTour)
    .patch(
        protectRoute,
        restrictTo('admin', 'lead-guide'), 
        updateTour
    )
    .delete(
        protectRoute, 
        restrictTo('admin', 'lead-guide'),
        deleteTour
    );

module.exports = router;