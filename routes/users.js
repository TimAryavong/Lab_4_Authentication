'use strict';
var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; // passport-local is an extention for passport


/* GET users listing. */
router.get('/', checkAuthentication, function (req, res, next) { //nothing I tried worked for authenticating... too complicated
    try {
        userModel.find({}, function (err, foundUsers) {
            //console.log(err);
            //console.log(foundUsers);
            // Pass found users from server to pug file
            res.render('users', { users: foundUsers, user: req.user.username });
        });
    } catch (err) {
        console.log("Error " + err);
    }
});
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;
