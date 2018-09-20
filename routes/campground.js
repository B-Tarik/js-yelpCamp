var express             = require('express'),
    sanitizeHtml        = require('sanitize-html'),
    Campground          = require('../models/campground'),
    router              = express.Router({mergeParams: true});

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
router.post('/', isLoggedIn, function(req, res) {
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
                console.log(newCampground);
                
                res.redirect('campgrounds');
            }
        });

});

// show new campground form
router.get('/new', isLoggedIn, function(req, res) {
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
router.get('/:id/edit', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, editCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/edit', {campground: editCampground});
        }
    });
    
});

// update campground
router.put('/:id', isLoggedIn, function(req, res) {
    req.body.campground.description = sanitizeHtml(req.body.campground.description);

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('campgrounds/' + req.params.id);
        }
    });
});

// delete campground
router.delete('/:id', isLoggedIn, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('campgrounds');
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;