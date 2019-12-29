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

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// router.param('id', tourController.checkID);

//create a checkbody middlware
//check if body contains a name and price property
//if not send back a 404 request
//add it to the post handler stack



router.route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour);

router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

// router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview);


module.exports = router;