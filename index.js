if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');

const session = require('express-session');
const flash = require('connect-flash');

const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');

const helmet = require('helmet');

/* Connecting to the database. */
mongoose
    .connect('mongodb://localhost:27017/yelp-camp', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Database Connection Established');
    })
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

/* A configuration object for the session. */
const sessionConfig = {
    name: 'session',
    secret: 'this-is-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        /* A security feature that prevents the cookie from 
        being accessed by client-side JavaScript. */
        httpOnly: true,
        /* HTTPS Only */
        // secure: true,
        /* Setting the cookie to expire in 7 days. */
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));
app.use(flash());

/* Initializing Passport */
app.use(passport.initialize());
app.use(passport.session()); /* To use persistent login sessions. */
/* Using the static authenticate method of model in LocalStrategy */
passport.use(new LocalStrategy(User.authenticate()));

// Storing and Removing User to/from the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// To remove data using these defaults:
app.use(mongoSanitize());

/* A middleware that sets some HTTP headers for security. */
// Disables the `contentSecurityPolicy` middleware but keeps the rest.
app.use(
    helmet({
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
    })
);

const scriptSrcUrls = [
    'https://stackpath.bootstrapcdn.com/',
    'https://api.tiles.mapbox.com/',
    'https://api.mapbox.com/',
    'https://kit.fontawesome.com/',
    'https://cdnjs.cloudflare.com/',
    'https://cdn.jsdelivr.net',
];

const styleSrcUrls = [
    'https://kit-free.fontawesome.com/',
    'https://stackpath.bootstrapcdn.com/',
    'https://api.mapbox.com/',
    'https://api.tiles.mapbox.com/',
    'https://fonts.googleapis.com/',
    'https://use.fontawesome.com/',
    'https://cdn.jsdelivr.net/',
];

const connectSrcUrls = [
    'https://api.mapbox.com/',
    'https://a.tiles.mapbox.com/',
    'https://b.tiles.mapbox.com/',
    'https://events.mapbox.com/',
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", 'blob:'],
            objectSrc: [],
            imgSrc: [
                "'self'",
                'blob:',
                'data:',
                'https://res.cloudinary.com/dyt1cqiyq/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                'https://images.unsplash.com/',
                'https://dummyimage.com/',
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

/* This is a middleware that is used to pass the current user 
to every single template. */
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//? Routes Middleware
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

/* Rendering the home page. */
app.get('/', (req, res) => {
    res.render('home');
});

/* This is a middleware that handles errors. */
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

/* This is a middleware that handles errors. */
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

/* Listening to port 3000. */
app.listen(3000, () => {
    console.log(`Yelp-Camp: Listening on port 3000`);
});
