/* Importing the express module and creating a router object. */
const express = require('express');
const router = express.Router();
/* Importing the catchAsync and ExpressError functions from the utils folder. */
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
/* Importing the JOI campgroundSchema from the schemas.js file. */
/* Importing the Campground model from the campground.js file in the models folder. */
const { campgroundSchema } = require('../schemas.js');
const Campground = require('../models/campground');

/**
 * @function catchAsync - Catching any errors that may occur in the async function
 */

/**
 * It takes in a request, response, and next function, and then validates the request body against the
 * campgroundSchema. If there is an error, it throws an ExpressError with the message from the error. If
 * there is no error, it calls the next function.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - a function that will be called when the middleware is complete.
 */
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

/* This is a route that is finding ALL the
campgrounds in the database. Rendering the index.ejs file in the campgrounds folder. */
router.get(
    '/',
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
    })
);

/* This is a route that is rendering the new.ejs file to create a new campground in the campgrounds folder. */
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

/* This is a route that is CREATING a new
campground object. Saving the campground to the database. Redirecting the user to the show page of
the campground that was just created. */
router.post(
    '/',
    validateCampground,
    catchAsync(async (req, res, next) => {
        const campground = new Campground(req.body.campground);
        await campground.save();
        req.flash('success', 'Successfully created a new campground!');
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

/* This is a route that is finding
the campground by the id and populating the reviews. Then rendering the show.ejs file in the
campgrounds folder. */
router.get(
    '/:id',
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id).populate('reviews');
        /* If the campground is not found, it will flash an error message and redirect the user to the
        campgrounds index page. */
        if (!campground) {
            req.flash('error', 'Campground not found!');
            res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', { campground });
    })
);

/* This is a route that is finding
the campground by the id. Then rendering the edit.ejs file in the campgrounds folder. */
router.get(
    '/:id/edit',
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        /* If the campground is not found, it will flash an error message and redirect the user to the
        campgrounds index page. */
        if (!campground) {
            req.flash('error', 'Campground not found!');
            res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', { campground });
    })
);

/* This is a route that is finding
the campground by the id and [UPDATING] the campground. Then redirecting the user to the show page of
the campground that was just updated. */
router.put(
    '/:id',
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        req.flash('success', 'Successfully updated the campground!');
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

/* This is a route that is finding
the campground by the id and [DELETING] the campground. Then redirecting the user to the index page of
the campgrounds. */
router.delete(
    '/:id',
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted the campground!');
        res.redirect('/campgrounds');
    })
);

/* Exporting the router object so that it can be used in other files. */
module.exports = router;
