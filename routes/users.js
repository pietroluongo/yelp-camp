const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/', (req, res) => {
    res.redirect('/register');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async(req, res, next) => {
    try {
        const {
            email, username, password
        } = req.body;
        const user = new User({ email,
            username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Yelp Camp!');
            return res.redirect('/campgrounds');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post(
    '/login',
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login' }),
    (req, res) => {
        req.flash('success', 'Welcome back!');
        res.redirect('/campgrounds');
    }
);

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged out successfully!');
    res.redirect('/campgrounds');
});

module.exports = router;