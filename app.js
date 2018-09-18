var express             = require('express'),
    sanitizeHtml        = require('sanitize-html'),
    bodyParser          = require('body-parser'),
    mongoose            = require('mongoose'),
    methodOverride      = require('method-override'),
    Campground          = require('./models/campground'),
    Comment          = require('./models/comment'),
    seedDB              = require('./seeds'),
    app                 = express();
    

// APP CONFIG
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static( __dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
seedDB();


app.get('/', function(req, res) {
    res.redirect('campgrounds');
});

// ===========================
// CAMPGROUNDS ROUTES
// ===========================
app.get('/campgrounds', function(req, res) {
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
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    });
    
});

app.post('/campgrounds', function(req, res) {
    req.body.campground.description = sanitizeHtml(req.body.campground.description);

        Campground.create(req.body.campground, function(err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('campgrounds');
            }
        });

});

app.get('/campgrounds/new', function(req, res) {
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
    
});

app.get('/campgrounds/:id/edit', function(req, res) {
    Campground.findById(req.params.id, function(err, editCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/edit', {campground: editCampground});
        }
    });
    
});

app.put('/campgrounds/:id', function(req, res) {
    req.body.campground.description = sanitizeHtml(req.body.campground.description);

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('campgrounds/' + req.params.id);
        }
    });
});

app.delete('/campgrounds/:id', function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('campgrounds');
        }
    });
});

// ===========================
// COMMENTS ROUTES
// ===========================
app.get('/campgrounds/:id/comments/new', function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

app.post('/campgrounds/:id/comments', function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds')
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

app.listen(3000, function() {
    console.log('server ON.');
    
});