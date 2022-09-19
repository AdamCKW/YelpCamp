const express = require('express'); // Require Express Package
const port = 3000; // Sets the express port to 3000
const path = require('path'); // Requires a path.
const mongoose = require('mongoose'); // Require the Mongoose Package.
const engine = require('ejs-mate'); // Requires ejs-mate engine.
const { campgroundSchema } = require('./schemas.js'); // Requires Joi Schema
const catchAsync = require('./utils/catchAsync'); // Catch async function for error handling.
const ExpressError = require('./utils/ExpressError'); // Returns a ExpressError.
const methodOverride = require('method-override'); // Requires method-override to use PUT/USE.
const Campground = require('./models/campground'); // Requires the Campground Scheme Model.

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

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
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
        const campground = await Campground.findById(req.params.id);
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
