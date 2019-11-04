const fs = require('fs');

//define our functions
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


//var that holds our route to get back data from a single tour
exports.getTour = (req, res) =>{

    const id = parseInt(req.params.id);
    const tour = tours.find(cur => cur.id === id);

    res.status(200).json({
        status: "success",
        data: {
            tours: tour
        }
    });
};

//var that holds our route to get all tours in our api

exports.getTours = (req, res) =>{

    res.status(200).json({
        status: 'success',
        data: {
            //first we specify the api link name
            tours:
            //then we specify our data object
            //if our data object was x we would place x here and the previous var would still be tours
            //since tours is the name of our api and x is simply the data variable
            //if they happen to share the same name you do not have to write it twice
            //I will specify it however because I need to remember this
            tours
        }
    })
};

//var that holds our data to update a tour

exports.updateTour = (req, res) =>{
    res.status(200).json({
        status: "success",
        data: {
            tours: "<Updated tour>"
        }
    });
};

exports.deleteTour = (req, res) =>{
    res.status(204).json({
        status: "success",
        data: null
    });
};

exports.createTour = (req, res) => {

    //console.log(req.body);

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId}, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
        res.status(201).json({
            status: 'success',
            data: {
                tours: newTour
            }
        });
    });
};

exports.checkID = (req, res, next, val) => {
    console.log(`Tour ID is: ${val}`);

    if(parseInt(req.params.id) > tours.length - 1){
        return res.status(404).json({
            status: "fail",
            message: "invalid ID"
        })
    }

    next();
};

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price){
        return res.status(404).json({
           status: "fail",
           message: "can not create a tour without a name"
        });
    }
    next();
};