const authController = require('../controllers/authController');
const express = require('express');
const reviewController = require('../controllers/reviewController');

//define our routers
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(authController.protect, reviewController.getAllReviews)
    .post(authController.protect,
        authController.restrictTo('user'),
        reviewController.createReview);

module.exports = router;