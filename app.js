var express             = require('express'),
    expressSession      = require('express-session'),
    sanitizeHtml        = require('sanitize-html'),
    bodyParser          = require('body-parser'),
    mongoose            = require('mongoose'),
    methodOverride      = require('method-override'),
    passport            = require('passport'),
    localStrategy       = require('passport-local'),
    Campground          = require('./models/campground'),
    Comment             = require('./models/comment'),
    User                = require('./models/user'),
    seedDB              = require('./seeds');

    

// APP CONFIG
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
var app = express();
app.set('view engine', 'ejs');
app.use(express.static( __dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
seedDB();

// PASSPORT CONFIG
app.use(expressSession({
    secret: 'this phrase will be used to encode & decode the sessions',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//==========================
// ROUTES
//==========================
app.get('/', function(req, res) {
    res.redirect('campgrounds');
});

//==========================
// CAMPGROUNDS ROUTES
//==========================
// show all campgrounds
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
            res.render('campgrounds/index', {campgrounds: allCampgrounds, });
        }
    });
    
});

// add campground
app.post('/campgrounds', isLoggedIn, function(req, res) {
    req.body.campground.description = sanitizeHtml(req.body.campground.description);

        Campground.create(req.body.campground, function(err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('campgrounds');
            }
        });

});

// show new campground form
app.get('/campgrounds/new', isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});

// show campground by id
app.get('/campgrounds/:id', function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
    
});

// show edit campground form
app.get('/campgrounds/:id/edit', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, editCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/edit', {campground: editCampground});
        }
    });
    
});

// update campground
app.put('/campgrounds/:id', isLoggedIn, function(req, res) {
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
app.delete('/campgrounds/:id', isLoggedIn, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('campgrounds');
        }
    });
});

//==========================
// COMMENTS ROUTES
//==========================
// show comment form
app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

// add new comment
app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
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

//==========================
//AUTH ROUTES
//==========================
// show register form
app.get('/register', function(req, res) {
    res.render('register');
});

// add user
app.post('/register', function(req, res) {
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
app.get('/login', function(req, res) {
    res.render('login');
});

// handling login
app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), function(req, res) {
        console.log(req.body);
        
    });

// logout page
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.listen(3000, function() {
    console.log('server ON.');
    
});