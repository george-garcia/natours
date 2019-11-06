const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');


dotenv.config({path: './config.env'});

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