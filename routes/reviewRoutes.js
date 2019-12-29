const authController = require('../controllers/authController');
const express = require('express');
const reviewController = require('../controllers/reviewController');

//define our routers
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(authController.protect, reviewController.getAllReviews)
    .post(authController.protect,
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview);

router.route('/:id')
    .get(reviewController.getReview)
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);

module.exports = router;