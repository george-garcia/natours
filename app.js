const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

//middleware that allows us to take in json from post requests to our server.
app.use(express.json());

// app.get('/', (req, res) =>{
//     res.status(200).json({message: 'Hello from the server side', app: 'This is another message.'});
// });
//
// app.post('/', (req, res) => {
//     res.status(200).send('You can post to this URL');
// });

//top level code
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


//var that holds our route to get back data from a single tour
const getTour = (req, res) =>{

    const id = parseInt(req.params.id);

    if(id > tours.length){
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }

    const tour = tours.find(cur => cur.id === id);

    res.status(200).json({
        status: "success",
        data: {
            tours: tour
        }
    });
};

//var that holds our route to get all tours in our api

const getTours = (req, res) =>{

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

const updateTour = (req, res) =>{
    res.status(200).json({
        status: "success",
        data: {
            tours: "<Updated tour"
        }
    });
};

const deleteTour = (req, res) =>{
    res.status(204).json({
        status: "success",
        data: null
    });
};

const createTour = (req, res) => {

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

// app.get('/api/v1/tours', getTours);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.post('/api/v1/tours', createTour);

app.route('/api/v1/tours')
    .get(getTours)
    .post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

const port = 3000;
app.listen(port, () =>{
    console.log(`App running on port ${port}...`)
});