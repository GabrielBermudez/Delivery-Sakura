var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose')
let cookieSession = require('cookie-session')
let fileUpload = require('express-fileupload')
let passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
					 
let indexRouter = require('./routes/index')
let loginRouter = require('./routes/login')
let registerRouter = require('./routes/register')
let signInRouter = require('./routes/signIn')
let userRouter = require('./routes/client/user')

var app = express();

//let mongoDB = 'mongodb://localhost/sakura';

let mongoDB = process.env.MONGO_DB || 'mongodb://localhost/sakura'
mongoose.connect(mongoDB,{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

app.use(cookieSession({
	name: 'session',
	keys: ['keyboard cat'],
	maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(function(req,res,next){
	res.locals.session = req.session;
	next();
});

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

/* Passport */

let userProfile

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

/*  Google AUTH  */
 
const GOOGLE_CLIENT_ID = '326321581873-f3q5m8jei1a110a865948ohlsvghotkd.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'jGS5tD3JWY3ad01yeJiLKyM3';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `http://${process.env.CALL_BACK_URL || 'localhost:3000'}/sign-in/auth/google/callback`
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/sign-in', signInRouter)
app.use('/client/user',userRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
