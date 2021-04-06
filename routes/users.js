const express = require('express');
const router = new express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {
    index,
    renderRegisterForm,
    register,
    renderLoginForm,
    login,
    logout
} = require('../models/User');

router.get('/', index);

router.get('/register', renderRegisterForm);

router.post('/register', catchAsync(register));

router.get('/login', renderLoginForm);

router.post(
    '/login',
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login' }),
    login
);

router.get('/logout', logout);

module.exports = router;