const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

router.get('/', (req, res) => {
    res.redirect('/register');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email,
            username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('register');
    }
}));

module.exports = router;