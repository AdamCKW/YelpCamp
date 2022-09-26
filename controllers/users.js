const User = require('../models/user');

/* Exporting the function renderRegister to the users.js file. */
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

/* This is the code that is executed when the user submits the registration form. It takes the email,
username, and password from the form and creates a new user. It then registers the user and logs
them in. */
module.exports.register = async (req, res) => {
    try {
        /* Destructuring the req.body object. */
        /* Creating a new user object. */
        /* Registering the user and logging them in. */
        /* Logging the user in. */
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        });
    } catch (error) {
        /* Displaying the error message on the page. */
        /* Redirecting the user to the register page. */
        req.flash('error', error.message);
        res.redirect('/register');
    }
};

/* This is the code that renders the login page. */
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

/* This is the code that is executed when the user submits the login form. It takes the email and
password from the form and logs the user in. */
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

/* This is the code that is executed when the user clicks the logout button. It logs the user out and
redirects them to the campgrounds page. */
module.exports.logout = function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/campgrounds');
    });
};
