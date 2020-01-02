const mongoose = require('mongoose');
const Tour = require('../models/tourModel');

// review / rating / createdAt / ref to tour / ref to user

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'A review must have a review']
    },
    rating: {
        type: Number,
        required: [true, 'A review must have a rating'],
        min: [1, "Rating must be no less than 1"],
        max: [5, "Rating must be no more than 5"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must belong to a tour']
        }
    ],
    user: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true}
});

reviewSchema.index({ tour: 1, user: 1}, { unique: true } );

reviewSchema.pre(/^find/, function(next){

    //Commenting this out because for our application we don't need to populate the tours
    // this.populate({
    //     path: 'tour',
    //     select: 'name -guides'
    //     // select: '-__v -passwordChangedAt'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // });

    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if(stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
};

reviewSchema.post('save', function(next) {
    // this points to the document that is currently being saved

    this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;