//require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
var cors = require('cors');
//console.log(__dirname);
require('dotenv').config({ path: __dirname + '/.env' })

// var indexRouter = require('./routes/index');
var indexRouter = require('./routes/index');
var postRouter = require('./routes/post');
var imageRouter = require('./routes/image');
var publicRouter = require('./routes/public');

var app = express();

const db = require("./model/index");

// view engine setup
// express.static(path.join(__dirname, '/public'));

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root
// app.use(timeout('30s'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(__dirname + '/public'));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

db.sequelize.sync();

app.use('/', indexRouter);
app.use('/post', postRouter);
app.use('/image', imageRouter);
app.use('/public', publicRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
