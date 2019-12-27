const slugify = require('slugify');
const mongoose = require('mongoose');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "a tour must have a name"],
        unique: true,
        trim: true,
        //min and max are only available on strings
        maxlength: [40, "a tour name must have less than or equal to 40 characters"],
        minlength: [8, "a tour name must be at least 8 characters"],
        //using validators from a library example. This library has many useful validators
        // validate: [validator.isAlpha, "Tour name must only contain characters"]
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, "a tour must have a duration"]
    },
    ratingsAverage: {
        type:Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5"]
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
        required: [true, "a tour must have a difficulty"],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty must be either: easy, medium, or difficult'
        }
    },
    price: {
        type: Number,
        required: [true, "a tour must have a price"]
    },
    //creating a custom validator
    priceDiscount: {
        type: Number,
        //the context of val here is the price discount
        //the return value must return false or true
        validate: {
            // this only points to current doc on NEW document creation
            validator: function(val) {
                return val < this.price;
            },
            //accessing the actual value here within the curly braces is unique to mongoose
            message: "Discount price ({VALUE}) should be be less than regular price"
        }
    },
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
    startDates: [Date],
    startLocation: {
        //MongoDB uses GeoJSON in order to specify geospatial data
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: {
        type: {
            type: String,
            default: 'Point',
            enum: 'Point'
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
        }
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true}
});

//VIRTUALS
tourSchema.virtual('durationWeeks').get(function(next) {
    return this.duration / 7;
});

//DOCUMENT MIDDLEWARE runs before .save() command and the .create() command
//however it does not run on .insertMany because .insertMany will not trigger the .save() command
// tourSchema.pre('save', function (next) {
//     this.slug = slugify(this.name, { lower: true });
//     next();
// });
//
// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// });

//QUERY MIDDLEWARE in this middleware the this keyword will point at the current query
//and not the current document.

//This query middleware however does not trigger on findbyidandupdate because that uses the
//findONe query and not the find query so to get around this limitation we will use regular expressions
tourSchema.pre(/^find/, function(next){
// tourSchema.pre('find', function(next){
    this.find({ secretTour: { $ne: true } });
    next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});

const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;