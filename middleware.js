const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/Campground');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to do that.');
        return res.redirect('/login');
    }
    return next();
};

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map((elem) => elem.message).join(','), 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map((elem) => elem.message).join(','), 400);
    } else {
        next();
    }
};