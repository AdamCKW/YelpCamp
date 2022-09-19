// Require Express Package
const express = require('express');
// Sets the express port to 3000
const port = 3000;
// Requires a path.
const path = require('path');
// Require the Mongoose Package.
const mongoose = require('mongoose');
// Requires ejs-mate engine.
const engine = require('ejs-mate');
// Catch async function for error handling.
const catchAsync = require('./utils/catchAsync');
// Returns a ExpressError.
const ExpressError = require('./utils/ExpressError');
// Requires method-override to use PUT/USE.
const methodOverride = require('method-override');
// Requires the Campground Scheme Model.
const Campground = require('./models/campground');

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

// Extends the express app with a new app.
const app = express();

app.engine('ejs', engine); // ejs engine.
app.set('view engine', 'ejs'); // Sets the view engine.
app.set('views', path.join(__dirname, 'views')); // Sets the views directory [/view/].
app.use(express.urlencoded({ extended: true })); // Allow receiving data from POST
app.use(methodOverride('_method')); // Overrides the default method to use _method.

// Render the home page.
app.get('/', (req, res) => {
    res.render('home');
});

// List all available campgrounds.
app.get(
    '/campgrounds',
    catchAsync(async (req, res, next) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
    })
);

// Create a new campground page
app.get('/campgrounds/new', (req, res, next) => {
    res.render('campgrounds/new');
});

// Add new campground to database
app.post(
    '/campgrounds',
    catchAsync(async (req, res, next) => {
        if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
        const campground = await Campground(req.body.campground);
        await campground.save();
        res.redirect(`campgrounds/${campground._id}`);
    })
);

// Show a specific Campground
app.get(
    '/campgrounds/:id',
    catchAsync(async (req, res, next) => {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/show', { campground });
    })
);

// Edit a Campground Page.
app.get(
    '/campgrounds/:id/edit',
    catchAsync(async (req, res, next) => {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', { campground });
    })
);

// Update a Campground.
app.put(
    '/campgrounds/:id',
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, {
            ...req.body.campground,
        });
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

// Delete a campground
app.delete(
    '/campgrounds/:id',
    catchAsync(async (req, res, next) => {
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
    const { status = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    // Renders the error page
    res.status(status).render('error', { err });
});

// Start listening on a given port.
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
