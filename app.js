const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express = require('express');

var session = require('express-session');

const indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

const {maxAge} = require("express-session/session/cookie");
const Cookies = require("cookies");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/api', apiRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret:"somesecretkey",
    resave: false, // Force save of session for each request
    saveUninitialized: false, // Save a session that is new, but has not been modified
    cookie: {maxAge: 30*60*1000},
    Name:"",
    email: ""
}));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    //next(createError(404));
});

// error handler





module.exports = app;