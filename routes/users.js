const express = require('express');
const router = new express.Router();
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

router.get('/', (req, res) => {
    res.redirect('/register');
})

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async(req, res) => {
    res.send(req.body);
}));

module.exports = router;