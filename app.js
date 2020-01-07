const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');

const app = express();

//GLOBAL MIDDLEWARE

//cors for use with our front-end
app.use(cors({
    origin: 'http://localhost:3000'
}));

//middleware that allows with logging

//set security http headers
app.use(helmet());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// limit requests
const limiter = rateLimit({
    //max 100 requests per hour
    max: 100,
    //60 seconds * 60 minutes * 1000 milliseconds or 1 hour in milliseconds
    windowMS: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

//middleware that allows us to take in json from post requests to our server.
// Body parse, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
});

app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next();
});

const reviewRouter = require('./routes/reviewRoutes');
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



app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.OriginalUrl} on this server.`
    // });
    next(new AppError(`Can't find ${req.url} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;