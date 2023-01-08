const reviewController = require('../controllers/reviewController');
const { protectRoute, restrictTo } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(reviewController.getAllReivews)
    .post(
        protectRoute,
        restrictTo('user'),
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);

module.exports = router;