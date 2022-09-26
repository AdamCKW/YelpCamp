const Campground = require('../models/campground');
const Review = require('../models/review');

/* This is a function that is being exported from the module. */
module.exports.createReview = async (req, res) => {
    /* Finding the campground by the id that is passed in the url. */
    /* Creating a new review object with the data that is passed in the request body. */
    /* Setting the author of the review to the user that is logged in. */
    /* Pushing the review object into the reviews array of the campground object. */
    /* Saving the review and campground objects to the database. */
    /* Setting a flash message that will be displayed on the next page. */
    /* Redirecting the user to the campground page. */
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully added a review!');
    res.redirect(`/campgrounds/${campground._id}`);
};

/* This is a function that is being exported from the module. */
module.exports.deleteReview = async (req, res) => {
    /* Destructuring the req.params object. */
    /* Finding the campground by the id that is passed in the url and then it is pulling the review
        from the reviews array of the campground object. */
    /* Finding the review by the id that is passed in the url and then it is deleting it. */
    /* Setting a flash message that will be displayed on the next page. */
    /* Redirecting the user to the campground page. */
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/campgrounds/${id}`);
};
