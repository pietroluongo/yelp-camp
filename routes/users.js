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
} = require('../controllers/users');

router.get('/', index);

router.route('/register')
    .get(renderRegisterForm)
    .post(catchAsync(register));

router.route('/login')
    .get(renderLoginForm)
    .post(
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login' }),
        login
    );

router.get('/logout', logout);

module.exports = router;