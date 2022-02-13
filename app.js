const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectionString = require('./database/db').db;

const userRoutes = require('./api/routes/user');
const batchRoutes = require('./api/routes/batch');
const assignmentRoutes = require('./api/routes/assignment');


// for connecting node app to mongo DB
mongoose.Promise = global.Promise;
mongoose.connect(connectionString,{ useNewUrlParser: true }).then(
    () => {
        console.log('Database is connected');
    },
    err => {
        console.log(err);
        console.log('err in connecting db');   
    }
);

// morgan => it's midddleware that help us to show the execustion time of request and many useful things
// body-parser => For showing the response 
//MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());    // deprecated
app.use(express.json()); 

// here we append the header to every incoming request / 
// settings CORS Headers
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin ,X-Requested-With, Content-Type , Accept , Authorization');
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({});
    }
    next();
});

//Routes which should handle Request like: User and Assignment section
app.use('/user', userRoutes);
app.use('/batch', batchRoutes);
app.use('/assignment', assignmentRoutes);

app.use((req,res,next) => {
    let error = new Error('Not Found');
    error.status =  404;
    next(error);
});

// Handle all the type of error in our application like 404,500,403, etc.
app.use((error,req,res,next) => {
    console.log(error);
    res.status(error.status || 500);
    res.json({
        error : {
            message:error.message
        }
    });
})


module.exports = app;