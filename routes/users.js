'use strict';
var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; // passport-local is an extention for passport


/* GET users listing. */
router.get('/', function (req, res) { //nothing I tried worked for authenticating... too complicated
    //passport.authenticate('local', {
    //    successRedirect: '/users',
    //    failureRedirect: '/login',
    //    failureMessage: 'Invalid Login'
    //})
    //console.log('poop out');
    //if (!req.user.username) {
    //    console.log('poop');
    //}
    //if (passport.use(new LocalStrategy(
    //    function (username, password, done) {
    //        userModel.findOne({
    //            username: username
    //        }, function (err, user) {
    //            if (err) {
    //                return done(err);
    //            }
    //            if (!user) {
    //                return done(null, false);
    //            }
    //            // compare hashed passwords
    //            if (!bcrypt.compareSync(password, user.password)) {
    //                return done(null, false);
    //            }
    //            //password works, no error
    //            return done(null, user);
    //        });
    //    }
    //))) {
    try {
        userModel.find({}, function (err, users) {
            console.log(err);
            console.log(users);
            // Pass found users from server to pug file
            res.render('users', { users: users, user: req.user.username });
        });
    } catch (err) {
        console.log("Error " + err);
    }
    
    //passport.serializeUser(function (user, done) {      
    //    done(null, user.id);                            
    //});

    //passport.deserializeUser(function (id, done) {      
    //    userModel.findById(id, function (err, user) {   
    //        if (err) res.redirect('/');                 
    //        done(err, user);                            
    //    });

    //});
    //if (req.user.id) {
    //    if (userModel.findById(req.user.id)) {
    //        res.render('users', {
    //            user: req.user.username
    //        })
    //    }
    //    else {
    //        res.redirect('/');
    //    }
    //}
    //else {
    //    res.redirect('/');
    //}
//        { username: loggedUser }, function (err, users) {
    //    if (err) console.log(err);
    //    if (users.length > 0) {
    //        console.log(users.length + 'username already exists please login!');
    //        return res.render('users');
    //    }
    //})
    
});

module.exports = router;
