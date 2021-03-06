const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');
const Tour = require('../../models/tourModel');
const express = require('express');

dotenv.config({path: './config.env'});
const app = express();



const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

//mongoose.connect(process.env.DATABASE_LOCAL, { // To connect to the local database
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('Database connection successful'));


const port = 3000;
app.listen(port, () =>{
    console.log(`App running on port ${port}...`)
});

//READ JSON FILE
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

//IMPORT DATA INTO DB
const importData = async () => {
    try {
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        await Tour.create(tours);
        console.log('Data successfully loaded');
    }
    catch (e) {
        console.log(e);
    }
};

//DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await User.deleteMany();
        await Review.deleteMany();
        await Tour.deleteMany();
        console.log("Data deleted successfully");
    }
    catch (e) {
        console.log(e);

    }
};

if(process.argv[2] === '--import'){
    importData();
} else if(process.argv[2] === '--delete'){
    deleteData();
}