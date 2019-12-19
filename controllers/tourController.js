const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

//define our functions
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


exports.aliasTopTours = async (req, res, next) =>{

    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();

};


//var that holds our route to get back data from a single tour
exports.getTour = async (req, res) =>{

    try{
        const tour = await Tour.findById(req.params.id);
        //Tour.findOne({ _id: req.params.id })

        res.status(200).json({
            status: "success",
            data: {
                tours: tour
            }
        })
    }

    catch (e) {
        res.status(400).json({
            status: "fail",
            message: e
        });
    }

    // const id = parseInt(req.params.id);
    // const tour = tours.find(cur => cur.id === id);
    //
    // res.status(200).json({
    //     status: "success",
    //     data: {
    //         tours: tour
    //     }
    // });
};

//var that holds our route to get all tours in our api

exports.getAllTours = async (req, res) =>{

    try {
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

        //EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
        const tours = await features.query;
        //query.sort().select().skip().limit()




        res.status(200).json({
            status: "success",
            results: tours.length,
            data: {
                tours: tours
            }
        });
    } catch(err){
        res.status(400).json({
            status: "fail",
            message: err
        })
    }

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
};

//var that holds our data to update a tour

exports.updateTour = async (req, res) =>{

    try {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: "success",
            data: {
                tour: tour
            }
        });
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }



    // res.status(200).json({
    //     status: "success",
    //     data: {
    //         tours: "<Updated tour>"
    //     }
    // });
};

exports.deleteTour = async (req, res) => {

    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: "success",
            data: null
        });
    }

    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
};

exports.createTour = async (req, res) => {
    
    try {

        const newTour = await Tour.create(req.body);

        res.status(200).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }

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


};

exports.getTourStats = async (req, res) => {
    try{

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

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try{
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

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
};

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