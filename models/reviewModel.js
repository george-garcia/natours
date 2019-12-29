const mongoose = require('mongoose');

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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;