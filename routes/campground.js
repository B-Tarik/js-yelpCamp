const express       = require('express'),
    sanitizeHtml    = require('sanitize-html'),
    Campground      = require('../models/campground'),
    mongoose            = require('mongoose'),
    middleware      = require('../middleware');


var router = express.Router({mergeParams: true});

// show all campgrounds
router.get('/', function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        allCampgrounds.forEach(function(elm) {
            elm.description = sanitizeHtml(elm.description, {
                allowedTags: [],
                allowedAttributes: []
            });
        });
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds, });
        }
    });
    
});

// add campground
router.post('/', middleware.isLoggedIn, function(req, res) {
    req.body.campground.description = sanitizeHtml(req.body.campground.description);

     // add username and id to campground
     var author = {
         id: req.user._id,
         username: req.user.username
     }
     req.body.campground.author = author;

        Campground.create(req.body.campground, function(err, newCampground) {
            if (err) {
                console.log(err);
            } else {
                req.flash('success', 'Successfully Added Campground');
                res.redirect('campgrounds');
            }
        });

});

// show new campground form
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});

// show campground by id
router.get('/:id', function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
    
});

// show edit campground form
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, editCampground) {
        res.render('campgrounds/edit', {campground: editCampground});
    });
});

// update campground
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    req.body.campground.description = sanitizeHtml(req.body.campground.description);

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Successfully Edited Campground');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// delete campground
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findByIdAndDelete(req.params.id, function(err, deletedCampground) {
            if (err) {
                console.log(err);
            } else {
                req.flash('success', 'Successfully Deleted Campground');
                res.redirect('/campgrounds');
            }
        });
});

module.exports = router;