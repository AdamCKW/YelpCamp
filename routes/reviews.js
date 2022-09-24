/* Importing the express module */
const express = require('express');
/* Creating a router object that will be used to handle the routes for the reviews. The mergeParams
option is set to true so that the request parameters from the campgrounds route will be available in
the reviews route. */
const router = express.Router({ mergeParams: true });
/* Importing the catchAsync and ExpressError functions from the utils folder. */
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
/* Importing the JOI campgroundSchema from the schemas.js file. */
const { reviewSchema } = require('../schemas.js');
/* Importing the Campground and Review models from the models folder. */
const Campground = require('../models/campground');
const Review = require('../models/review');

/**
 * @function catchAsync - Catching any errors that may occur in the async function
 */

/**
 * It takes in a request, response, and next function, and then validates the request body against the
 * reviewSchema. If there is an error, it throws an ExpressError with the message from the error. If
 * there is no error, it calls the next function.
 * @param req - the request object
 * @param res - the response object
 * @param next - a function that will be called when the middleware is complete.
 */
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

/* This is a post request that is being sent to the server to [CREATE] a new review. 
-Finding the campground by the id that is in the request parameters. 
-Creating a new review object with the data from the request body.
-Pushing the review into the reviews array in the campground model.
-Saving the review and campground to the database.
-Redirecting the user to the campground page.
*/
router.post(
    '/',
    validateReview,
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash('success', 'Successfully added a review!');
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

/* This is a [DELETE] request that is being sent to the server to delete a review. 
-Destructuring the id and reviewId from the request parameters.
-Finding the campground by the id and updating the reviews array by removing the reviewId.
-Finding the review by the reviewId and deleting it from the database.
-Redirecting the user to the campground page.
*/
router.delete(
    '/:reviewId',
    catchAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Successfully deleted a review!');
        res.redirect(`/campgrounds/${id}`);
    })
);

/* Exporting the router object so that it can be used in other files. */
module.exports = router;
