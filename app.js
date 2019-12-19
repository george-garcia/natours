const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();


//middleware that allows us to take in json from post requests to our server.
app.use(express.json());
//middleware that allows with logging

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next();
});

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.OriginalUrl} on this server.`
    });
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
});

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

module.exports = app;