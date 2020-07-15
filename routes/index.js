'use strict';
var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
var bcrypt = require('bcryptjs');
var passport = require('passport');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { user: req.user }); // this gives layout if(!user) to check
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}));

/*GET Login page*/
router.get('/login', function (req, res) {
    res.render('login');
});

/*GET Logout destroys session*/
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

/*GET register page*/
router.get('/register', function (req, res) {
    res.render('register');
});

/*POST register page*/
router.post('/register', function (req, res) {
    //Insert a new registered user
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        var registerUser = {
            username: req.body.username,
            password: hash
        }
        // check if the user already exists
        // using mongoose userModel schema, mongo finds out if any user names match the one to be registered
        // function returns list of user with the same name(if any), if the length of the list is more than 0, then the name is already taken
        userModel.find({ username: registerUser.username }, function (err, user) {
            if (err) console.log(err);
            if (user.length > 0) {
                console.log(user.length + 'username already exists please login!');
                return res.redirect('/');
            }
            const newUser = new userModel(registerUser);
            newUser.save(function (err) {
                console.log('inserting new user!');
                if (err) console.log(err);
                req.login(newUser, function (err) {
                    console.log('trying to login');
                    if (err) console.log(err);
                    return res.redirect('/');
                });
            });
        });
    })
});
module.exports = router;
