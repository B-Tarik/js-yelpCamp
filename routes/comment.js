const express       = require('express'),
    Campground      = require('../models/campground'),
    Comment         = require('../models/comment'),
    middleware      = require('../middleware'),
    mongoose        = require('mongoose'),
    router          = express.Router({mergeParams: true});

// show comment form
router.get('/new', middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

// add new comment
router.post('/', middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds')
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash('error', 'Something went wrong...');
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;

                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Successfully added comment');
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// show edit comment form
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, editComment) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: editComment});
        }
    });
});

// update comment
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err) {
        if (err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Successfully Edited comment');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// delete comment
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndDelete(req.params.comment_id, function(err) {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Successfully Deleted comment');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});


module.exports = router;