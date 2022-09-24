/* Importing the express module and creating a new express app. */
/* A core module that is used to work with file and directory paths. */
const express = require('express');
const app = express();
const path = require('path');
/* A template engine for Node.js. */
const ejsMate = require('ejs-mate');
/* Importing the express session module */
const session = require('express-session');
/* Importing connect-flash module to display messages to the user. */
const flash = require('connect-flash');
/* Importing the mongoose module. */
const mongoose = require('mongoose');
/* Importing the ExpressError function from the utils folder. */
/* Overriding the default method to use _method. */
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

//? Importing js file from the routes folder
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

/* Connecting to the mongoDB database. */
mongoose
    .connect('mongodb://localhost:27017/yelp-camp', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Database Connection Established');
    })
    .catch((err) => console.log(err));

/* Setting the view engine to ejs format. */
/* Setting the views directory to the views folder. */
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));

//? Middleware
/* Allowing the app to receive data from POST requests. */
/* Overriding the default method to use _method. */
/* Middleware that is used to serve static files. */
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

/* Configuration for the session. */
const sessionConfig = {
    secret: 'this-is-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        /* A security feature that prevents the cookie from 
        being accessed by client-side JavaScript. */
        httpOnly: true,
        /* Setting the cookie to expire in 7 days. */
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
/* Configuring the session. */
app.use(session(sessionConfig));
/* A middleware that is used to display messages to the user. */
app.use(flash());

/* This is a middleware that is used to set the success message to 
the locals object. */
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//? Routes Middleware
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

/* Rendering the home page. */
app.get('/', (req, res) => {
    res.render('home');
});

/* This is a middleware that is used to catch all routes that don't exist. */
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

/* This is a middleware that is used to catch all routes that don't exist. 
- Destructuring the err object and setting the statusCode to 500 if it is not defined.
- If the error message is not defined, use default
- Rendering the error page and passing the err object to the error page.
*/
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

/* This is the server listening on port 3000. */
app.listen(3000, () => {
    console.log(`Yelp-Camp: Listening on port 3000`);
});
