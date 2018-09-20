var express             = require('express'),
    expressSession      = require('express-session'),
    bodyParser          = require('body-parser'),
    mongoose            = require('mongoose'),
    methodOverride      = require('method-override'),
    passport            = require('passport'),
    localStrategy       = require('passport-local'),

    User                = require('./models/user'),
    // seedDB              = require('./seeds'),

    // requiring routes
    indexRoutes         = require('./routes/index'),
    campgroundRoutes    = require('./routes/campground'),
    commentRoutes       = require('./routes/comment');

    

// APP CONFIG
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
var app = express();
app.set('view engine', 'ejs');
app.use(express.static( __dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
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