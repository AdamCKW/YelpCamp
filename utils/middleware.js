const ExpressError = require('./ExpressError');
const { campgroundSchema, reviewSchema } = require('../schemas.js');
const Campground = require('../models/campground');
const Review = require('../models/review');

/* This is a middleware function that checks if the user is logged in. If the user is not logged in,
then the user is redirected to the login page. */
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
};

/**
 * If the campgroundSchema.validate() method returns an error, then throw an ExpressError with the
 * error message and a 400 status code. Otherwise, call the next() function.
 * @param req - the request object
 * @param res - the response object
 * @param next - a function that will be called when the middleware is complete.
 */
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

/**
 * It takes in a request, response, and next function, and then validates the request body against the
 * reviewSchema. If there is an error, it throws an ExpressError with the message from the error. If
 * there is no error, it calls the next function.
 * @param req - the request object
 * @param res - the response object
 * @param next - a function that will be called when the middleware is complete.
 */
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

/**
 * If the campground's author is not equal to the user's id, then redirect to the campground's show
 * page.
 * @param req - the request object
 * @param res - the response object
 * @param next - This is a callback that will be called when the middleware is done.
 * @returns The function isAuthor is being returned.
 */
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

/**
 * If the user is not the author of the review, then redirect them to the campground show page.
 * @param req - the request object
 * @param res - the response object
 * @param next - This is a callback that will be called when the middleware is done.
 * @returns The review object is being returned.
 */
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};
