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
    indexRoutes         = require('./routes'),
    campgroundRoutes    = require('./routes/campground'),
    commentRoutes       = require('./routes/comment');

    

// APP CONFIG
var url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp';
mongoose.connect( url, { useNewUrlParser: true });


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





app.listen(process.env.PORT || 3000, process.env.IP , function() {
    console.log('server ON.');
});
// app.listen(3000, function() {
//     console.log('server ON.');heroku config:set NODE_MODULES_CACHE=false
// });