var mongoose        = require('mongoose'),
    Campground      = require('./models/campground'),
    Comment      = require('./models/comment');

var data = [
    {
        name: 'Yellow Tent',
        image: 'https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&h=350',
        description: 'Yellow Tent Under Starry Night'
    },
    {
        name: 'Red Tent',
        image: 'https://images.pexels.com/photos/776117/pexels-photo-776117.jpeg?auto=compress&cs=tinysrgb&h=350',
        description: 'Man and Woman Sitting Beside Bonfire during Nigh Time'
    },
    {
        name: 'Blue Tent',
        image: 'https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&h=350',
        description: 'Blue Tent Under Starry Night'
    }
];

function seedDB() {
    // Remove all campgrounds
    Campground.deleteMany({}, function(err) {
        if (err) {
            console.log(err);
        } 
        console.log('removed campgrounds');

            // Add some campgrounds
        // data.forEach(function(seed) {
        //     Campground.create(seed, function(err, campground) {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             console.log('added campgrounds');

        //             // Add some comments
        //             Comment.create(
        //                 {
        //                     text: 'This place is great',
        //                     author: 'Homer'
        //                 }, function(err, comment) {
        //                     if (err) {
        //                         console.log(err);
        //                     } else {
        //                         campground.comments.push(comment);
        //                         campground.save();
        //                         console.log('created new comment');
                                
        //                     }
        //                 }
        //             );
        //         }
        //     });
        // });
    });

   
    
}

module.exports = seedDB;