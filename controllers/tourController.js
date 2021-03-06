const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');

//define our functions
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


exports.aliasTopTours = async (req, res, next) =>{

    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();

};

exports.getAllTours = factory.getAll(Tour);

//var that holds our route to get back data from a single tour

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

// exports.getTour = catchAsync(async (req, res, next) =>{
//
//     // this is how we set up our query originally to populate our referenced user IDs
//     // to instead show the whole user object when I search through tours
//     // const tour = await Tour.findById(req.params.id).populate({
//     //     path: 'guides',
//     //     select: '-__v -passwordChangedAt'
//     // });
//
//     const tour = await Tour.findById(req.params.id).populate('reviews');
//
//     //Tour.findOne({ _id: req.params.id })
//
//     if (!tour){
//         return next(new AppError('No tour found with that ID', 404));
//     }
//
//     res.status(200).json({
//         status: "success",
//         data: {
//             tours: tour
//         }
//     })


    // const id = parseInt(req.params.id);
    // const tour = tours.find(cur => cur.id === id);
    //
    // res.status(200).json({
    //     status: "success",
    //     data: {
    //         tours: tour
    //     }
    // });
// });

//var that holds our route to get all tours in our api

// exports.getAllTours = catchAsync(async (req, res, next) =>{

        //BUILD OUR QUERY

        // //1. FILTERING
        // const queryObj = {...req.query};
        // const exludedFields = ['page', 'sort', 'limit', 'fields'];
        // exludedFields.forEach(cur => delete queryObj[cur]);
        //
        // //2. ADVANCED FILTERING
        // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, cur => `$${cur}`);
        // console.log(queryStr);
        //
        // let query = Tour.find(JSON.parse(queryStr));

        //3. SORTING
        // if(req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     query = query.sort(sortBy);
        // } else {
        //     query = query.sort('-createdAt');
        // }
        //
        // // FIELD LIMITING
        // if(req.query.fields){
        //     const fields = req.query.fields.split(',').join(' ');
        //     query = query.select(fields);
        // } else {
        //     query = query.select('-__v');
        // }

        // //PAGINATION
        //
        // const page = req.query.page * 1 || 1;
        // const limit = req.query.limit * 1 || 100;
        // const skip = (page - 1) * limit;
        //
        // query = query.skip(skip).limit(limit);
        //
        //     //throw an error if we try to show a page that doesn't exist
        //     //for example if there aren't enough tours to display more pages
        //     //we shouldn't let them see a blank page with no tours
        //
        // if(req.query.page){
        //     const numTours = await Tour.countDocuments();
        //     if(skip >= numTours) throw new Error('This page does not exist');
        // }

        // const tours = await Tour.find({
        //     duration: 5,
        //     difficulty: "easy"
        // });

        // const tours = await Tour.find()
        //     .where('duration').equals(5)
        //     .where('difficulty').equals('easy');

//         //EXECUTE QUERY
//         const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
//         const tours = await features.query;
//         //query.sort().select().skip().limit()
//
//
//
//
//     res.status(200).json({
//         status: "success",
//         results: tours.length,
//         data: {
//             tours: tours
//         }
//     });
// });

    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         //first we specify the api link name
    //         tours:
    //         //then we specify our data object
    //         //if our data object was x we would place x here and the previous var would still be tours
    //         //since tours is the name of our api and x is simply the data variable
    //         //if they happen to share the same name you do not have to write it twice
    //         //I will specify it however because I need to remember this
    //         tours
    //     }
    // })


//var that holds our data to update a tour

exports.updateTour = factory.updateOne(Tour);
//Our old code before updating to using our factory
// exports.updateTour = catchAsync(async (req, res, next) =>{
//
//
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     });
//
//     if (!tour){
//         return next(new AppError('No tour found with that ID', 404));
//     }
//
//     res.status(200).json({
//         status: "success",
//         data: {
//             tour: tour
//         }
//     });

    // res.status(200).json({
    //     status: "success",
    //     data: {
    //         tours: "<Updated tour>"
    //     }
    // });
// });

exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//
//     const tour = await Tour.findByIdAndDelete(req.params.id);
//
//     if (!tour){
//         return next(new AppError('No tour found with that ID', 404));
//     }
//
//     res.status(204).json({
//         status: "success",
//         data: null
//     });
// });

// const catchAsync = fn => {
//     return (req, res, next) => {
//         fn(req, res, next).catch(next);
//     };
// };

exports.createTour = factory.createOne(Tour);
// exports.createTour = catchAsync(async (req, res, next) => {
//     const newTour = await Tour.create(req.body);
//
//     res.status(201).json({
//         status: 'success',
//         data: {
//             tour: newTour
//         }
//     });
// });

// exports.createTour = async (req, res) => {
//
//     try {
//
//         const newTour = await Tour.create(req.body);
//
//         res.status(200).json({
//             status: "success",
//             data: {
//                 tour: newTour
//             }
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: "fail",
//             message: err
//         });
//     }
// };

    //console.log(req.body);

    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({ id: newId}, req.body);
    //
    // tours.push(newTour);
    //
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
    //     res.status(201).json({
    //         status: 'success',
    //         data: {
    //             tours: newTour
    //         }
    //     });
    // });



exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty'},
                numTours: { $sum: 1},
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: { 'avgPrice': 1 }
        },
        // {
        //     $match: { _id: { $ne: 'EASY' } }
        // }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats: stats
        }
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id'}
        },
        {
            $project: { _id: 0 }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 12
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan: plan
        }
    });
});

// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour ID is: ${val}`);
//
//     if(parseInt(req.params.id) > tours.length - 1){
//         return res.status(404).json({
//             status: "fail",
//             message: "invalid ID"
//         })
//     }
//
//     next();
// };

// exports.checkBody = (req, res, next) => {
//     if(!req.body.name || !req.body.price){
//         return res.status(404).json({
//            status: "fail",
//            message: "can not create a tour without a name"
//         });
//     }
//     next();
// };

exports.getToursWithin = catchAsync(async (req, res, next) => {
// We could have done the URL more how a standard filter query would look like
// /tours-within?distance=233&center=-40,45&unit=mi
//
// However instead we choose to write it like this
// /tours-within/233/center/-40,45/unit/mi

    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    //radius of earth in miles
    const earthRadiusMiles = 3963.2;
    //radius of earth in kilometers
    const earthRadiusKilos = 6378.1;

    const radius = unit === 'mi' ? distance / earthRadiusMiles : distance / earthRadiusKilos;

    if(!lat || !lng){
        next(new AppError('Please provide latitude and longitude in the format of lat,lng.', 400));
    }

    console.log(distance, lat, lng, unit);

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius ]}}
    });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    });

});