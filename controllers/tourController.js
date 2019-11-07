const Tour = require('../models/tourModel');

//define our functions
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


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

        const tours = await Tour.find();

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