//define our middleware
const authController = require('../controllers/authController');
const express = require('express');
const reviewRouter = require('../routes/reviewRoutes');
const tourController = require('../controllers/tourController');


//define our routers
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(tourController.aliasTopTours ,tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(
    authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);

// router.param('id', tourController.checkID);

//create a checkbody middlware
//check if body contains a name and price property
//if not send back a 404 request
//add it to the post handler stack

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
// We could have done the URL more how a standard filter query would look like
// /tours-distance?distance=233&center=-40,45&unit=mi
//
// However instead we choose to write it like this
// /tours-distance/233/center/-40,45/unit/mi



router.route('/')
    .get(tourController.getAllTours)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);

router.route('/:id')
    .get(tourController.getTour)
    .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

// router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview);


module.exports = router;