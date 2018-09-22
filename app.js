const express           = require('express'),
    expressSession      = require('express-session'),
    bodyParser          = require('body-parser'),
    mongoose            = require('mongoose'),
    methodOverride      = require('method-override'),
    passport            = require('passport'),
    localStrategy       = require('passport-local'),
    flash               = require('connect-flash'),

    User                = require('./models/user'),
    // seedDB              = require('./seeds'),

    // requiring routes
    indexRoutes         = require('./routes/index'),
    campgroundRoutes    = require('./routes/campground'),
    commentRoutes       = require('./routes/comment');

    

// APP CONFIG
// mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
mongoose.connect('mongodb://tarik:password2018@ds219130.mlab.com:19130/yelpcamp', { useNewUrlParser: true });

mongoose.set('useFindAndModify', false);
var app = express();
app.set('view engine', 'ejs');
app.use(express.static( __dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();

// PASSPORT CONFIG
app.use(expressSession({
    secret: 'this phrase will be used to encode & decode the sessions',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.listen(3000, function() {
    console.log('server ON.');
    
});