"use strict";

var express = require('express');

var path = require('path'); //const mongoose = require('mongoose');


var ejsMate = require('ejs-mate');

var catchAsync = require('./utils/catchAsync');

var ExpressError = require('./utils/ExpressError');

var methodOverride = require('method-override'); //const RawVid = require('./models/RawVid');

/*mongoose.connect('mongodb://localhost:27017/smartly-surf', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});*/


var app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({
  extended: true
}));
app.use(methodOverride('_method'));
app.use("/public", express["static"]('public'));
app.get('/', function (req, res) {
  res.render("home.ejs");
});
app.get('/record', function (req, res) {
  res.render('recording.ejs');
});
app.all('*', function (req, res, next) {
  next(new ExpressError('Page Not Found', 404));
});
app.use(function (err, req, res, next) {
  var _err$statusCode = err.statusCode,
      statusCode = _err$statusCode === void 0 ? 500 : _err$statusCode;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', {
    err: err
  });
});
app.listen(3000, function () {
  console.log('Serving on port 3000');
});