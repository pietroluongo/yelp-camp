module.exports.isLoggedIn = (req, res, next) => {
    console.log(`REQ.USER... ${req.user}`);
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in to do that.');
        return res.redirect('/login');
    }
    return next();
};