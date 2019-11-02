const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();


//middleware that allows us to take in json from post requests to our server.
app.use(express.json());
//middleware that allows with logging
app.use(morgan('dev'));

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// app.get('/', (req, res) =>{
//     res.status(200).json({message: 'Hello from the server side', app: 'This is another message.'});
// });
//
// app.post('/', (req, res) => {
//     res.status(200).send('You can post to this URL');
// });

//top level code



// app.get('/api/v1/tours', getTours);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.post('/api/v1/tours', createTour);

// ===================== ROUTES ================================




app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);





const port = 3000;
app.listen(port, () =>{
    console.log(`App running on port ${port}...`)
});