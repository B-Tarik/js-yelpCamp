var express     = require('express'),
    passport    = require('passport'),
    User        = require('../models/user'),
    router      = express.Router({mergeParams: true});


router.get('/', function(req, res) {
    res.redirect('/campgrounds');
});

// show register form
router.get('/register', function(req, res) {
    res.render('register');
});

// add user
router.post('/register', function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render('/register');
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/campgrounds');
        });
    });
});

// show login form
router.get('/login', function(req, res) {
    res.render('login');
});

// handling login
router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), function(req, res) {
        console.log(req.body);
    });

// logout page
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/campgrounds');
});


module.exports = router;