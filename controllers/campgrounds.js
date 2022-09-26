const Campground = require('../models/campground');

/* This is a function that renders the index view with the campgrounds data. */
module.exports.index = async (req, res) => {
    /* Finding all the campgrounds in the database and storing them in the campgrounds variable. */
    /* Rendering the index view with the campgrounds data. */
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

/* A function that renders the new campground form. */
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

/* This is a function that creates a new campground. */
module.exports.createCampground = async (req, res, next) => {
    /* Creating a new campground with the data from the form. */
    /* Setting the author of the campground to the user that is logged in. */
    /* Saving the campground to the database. */
    /* Flash message that is displayed to the user when they create a new campground. */
    /* Redirecting the user to the show page of the campground that they just created. */
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

/* This is a function that shows a single campground. */
module.exports.showCampground = async (req, res) => {
    /* Destructuring the id from the req.params object. */
    /* This is a query that is finding a campground by id and populating the reviews and author fields. */
    /* This is checking if the campground is not found. If it is not found, it will flash an error
        message and redirect the user to the campgrounds index page. */
    /* Rendering the show view with the campground data. */
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author',
            },
        })
        .populate('author');
    if (!campground) {
        req.flash('error', 'Campground not found!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
};

/* This is a function that renders the edit campground form. */
module.exports.renderEditForm = async (req, res) => {
    /* Destructuring the id from the req.params object. */
    /* Finding a campground by id and storing it in the campground variable. */
    /* This is checking if the campground is not found. If it is not found, it will flash an error
        message and redirect the user to the campgrounds index page. */
    /* Rendering the edit view with the campground data. */
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not found!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

/* This is a function that updates a campground. */
module.exports.updateCampground = async (req, res) => {
    /* Destructuring the id from the req.params object. */
    /* Finding the campground by id and updating it with the new data. */
    /* Flash message that is displayed to the user when they update a campground. */
    /* Redirecting the user to the show page of the campground that they just created. */
    const { id } = req.params;
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

/* A function that deletes a campground. */
module.exports.deleteCampground = async (req, res) => {
    /* Destructuring the id from the req.params object. */
    /* Finding a campground by id and deleting it. */
    /* Flash message that is displayed to the user when they delete a campground. */
    /* Redirecting the user to the campgrounds index page. */
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
};
