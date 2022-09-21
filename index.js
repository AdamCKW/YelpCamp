const express = require('express'); // Require Express Package
const port = 3000; // Sets the express port to 3000
const path = require('path'); // Requires a path.
const mongoose = require('mongoose'); // Require the Mongoose Package.
const engine = require('ejs-mate'); // Requires ejs-mate engine.
const { campgroundSchema, reviewSchema } = require('./schemas.js'); // Requires Joi Schema
const catchAsync = require('./utils/catchAsync'); // Catch async function for error handling.
const ExpressError = require('./utils/ExpressError'); // Returns a ExpressError.
const methodOverride = require('method-override'); // Requires method-override to use PUT/USE.
// * Mongoose/Mongo JSON Schema
const Campground = require('./models/campground'); // Requires the Campground Scheme Model.
const Review = require('./models/review'); // Requires the Review Scheme Model.

// Establishes a connection to MongoDB.
mongoose
    .connect('mongodb://localhost:27017/yelp-camp', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Database Connection Established');
    })
    .catch((err) => console.log(err));

const app = express(); // Extends the express app with a new app.

app.engine('ejs', engine); // ejs engine.
app.set('view engine', 'ejs'); // Sets the view engine.
app.set('views', path.join(__dirname, 'views')); // Sets the views directory [/view/].

app.use(express.urlencoded({ extended: true })); // Allow receiving data from POST
app.use(methodOverride('_method')); // Overrides the default method to use _method.

// Validate a campground request.
const validateCampground = (req, res, next) => {
    // Validate the body of the request.
    const { error } = campgroundSchema.validate(req.body);
    // Throws an ExpressError if there is an error.
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        // Proceed if no error.
        next();
    }
};

// Validate a review request.
const validateReview = (req, res, next) => {
    // Validate the body of the request.
    const { error } = reviewSchema.validate(req.body);
    // Throws an ExpressError if there is an error.
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        // Proceed if no error
        next();
    }
};

// Render the home page.
app.get('/', (req, res) => {
    res.render('home');
});

// List all available campgrounds.
app.get(
    '/campgrounds',
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
    })
);

// Create a new campground page
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// Add new campground to database
app.post(
    '/campgrounds',
    validateCampground,
    catchAsync(async (req, res, next) => {
        // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

// Show a specific Campground
app.get(
    '/campgrounds/:id',
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id).populate('reviews');
        res.render('campgrounds/show', { campground });
    })
);

// Edit a Campground Page.
app.get(
    '/campgrounds/:id/edit',
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', { campground });
    })
);

// Update a Campground.
app.put(
    '/campgrounds/:id',
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

// Delete a campground
app.delete(
    '/campgrounds/:id',
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect('/campgrounds');
    })
);

// Create a campground review.
app.post(
    '/campgrounds/:id/reviews',
    validateReview,
    catchAsync(async (req, res) => {
        // Find a Campground by ID.
        const campground = await Campground.findById(req.params.id);
        // Creates a new Review object.
        const review = new Review(req.body.review);
        // Adds a review to the campground.
        campground.reviews.push(review);
        // Saves the review and campground to the database.
        await review.save();
        await campground.save();
        // Redirect to the campground.
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

// Delete a campground review
app.delete(
    '/campgrounds/:id/reviews/:reviewId',
    catchAsync(async (req, res) => {
        // Destructure req.params into review id and reviewId
        const { id, reviewId } = req.params;
        // Finds the campground & the specific review id in the array and removes it
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        // Finds a review by id and deletes it.
        await Review.findByIdAndDelete(reviewId);
        // Redirect to the Campground page.
        res.redirect(`/campgrounds/${id}`);
    })
);

// If page doesn't exist, show error
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Error Handler.
app.use((err, req, res, next) => {
    // Default error message
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err }); // Renders the error page
});

// Start listening on a given port.
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
