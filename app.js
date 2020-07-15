'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');                       // password encryption
var mongoose = require('mongoose');                     // mongoose for mongoDB schemas
var session = require('express-session');               // session to store users
var passport = require('passport');                     // passport where sessions are stored
var LocalStrategy = require('passport-local').Strategy; // passport-local is an extention for passport

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

const uri = "mongodb+srv://root:admin@cluster0-0wwxc.mongodb.net/AuthenticationDB?retryWrites=true&w=majority"; // wish to find a way to hide password

try { // from class lecture, verbatim
    mongoose.connect(uri, { useNewUrlParser: true }); // uri means Uniform Resource Identifier
    var db = mongoose.connection;
    db.on('error', function (err) { // on an error
        console.log(err);
    })
    db.once('open', function (callback) {
        console.log('Connected to MongoDB');
    })
}
catch (err) {
    consol.log("Error: " + err);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// define the session required for passport session, need this to save the session, must be defined after express.static
app.use(session({
    secret: 'test',
    saveUninitialized: true,
    resave: true
}));

// init passport (think cookies)
app.use(passport.initialize());                     // routes after this
app.use(passport.session());                        // must define session before this step

app.use('/', routes);
app.use('/users', users);                           // routes have to go after passport.initialize()

var userModel = require('./models/user');

// serialize the user
passport.serializeUser(function (user, done) {      // serialize user arg, given done function
    done(null, user.id);                            // saves user to the session
});

// deserialize the user
passport.deserializeUser(function (id, done) {      // deserialize id arg, given done function
    userModel.findById(id, function (err, user) {   // find the mongoose model in the mongoDB via. id
        if (err) console.log(err);                  // if not found log error
        done(err, user);                            // if done is given a specific err arg, the user is likely empty(..?), saves result to the session
    });
});

// local strategy for authenticating users (local meaning, this websites method of login/register/logout/authenticate )
passport.use(new LocalStrategy(
    function (username, password, done) {                           
        userModel.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            // compare hashed passwords
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false);
            }
            //password works, no error
            return done(null, user);
        });
    }
));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
