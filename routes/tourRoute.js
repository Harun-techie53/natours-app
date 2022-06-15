const express = require('express');
const router = express.Router();
const {
    getTours, 
    getTour, 
    createTour, 
    updateTour
} = require('../controllers/tourController');

router
    .route('/')
    .get(getTours)
    .post(createTour);

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour);

module.exports = router;