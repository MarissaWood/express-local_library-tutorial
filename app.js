var createError = require('http-errors')
var express = require('express')
var path = require('path')
// var favicon = require('serve-favicon') //added this
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser') // added this
var logger = require('morgan')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var catalogRouter = require('./routes/catalog')  // Import routes for "catalog" area of site

var compression = require('compression')
var helmet = require('helmet')

var app = express()

app.use(helmet())
var mongoose = require('mongoose')
var mongoDB = process.env.MONGDB_URI || 'mongodb://user123:garlicnoodle14@ds151840.mlab.com:51840/local_library'
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))) // added this
app.use(logger('dev'))
app.use(bodyParser.json())// added this
app.use(bodyParser.urlencoded({ extended: false })) // added this
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(compression()); //Compress all routes

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/catalog', catalogRouter) // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // next(createError(404))
  var err = new Error('Not Found') // added
  err.status = 404 // added
  next(err) // added
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
