//define our middleware

const express = require('express');

const tourController = require('../controllers/tourController');


//define our routers
const router = express.Router();

// router.param('id', tourController.checkID);

//create a checkbody middlware
//check if body contains a name and price property
//if not send back a 404 request
//add it to the post handler stack



router.route('/')
    .get(tourController.getTours)
    .post(tourController.createTour);

router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;