
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "a tour must have a name"],
        unique: true,
        trim: true
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, "a tour must have a duration"]
    },
    ratingsAverage: {
        type:Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    maxGroupSize: {
        type: Number,
        required: [true, "a tour must have a group size"]
    },
    difficulty: {
        type: String,
        required: [true, "a tour must have a difficulty"]
    },
    price: {
        type: Number,
        required: [true, "a tour must have a price"]
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, "a tour must have a description"]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "a tour must have a cover image"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true}
});

VIRTUALS
tourSchema.virtual('durationWeeks').get(function(next) {
    return this.duration / 7;
});

//DOCUMENT MIDDLEWARE runs before .save() command and the .create() command
//however it does not run on .insertMany because .insertMany will not trigger the .save() command
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

tourSchema.post('save', function (doc, next) {
    console.log(doc);
    next();
});

const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;