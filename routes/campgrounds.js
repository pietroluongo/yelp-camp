const express = require('express');
const router = new express.Router();
const Campground = require('../models/Campground');
const { campgroundSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const { ExpressError } = require('../utils/ExpressError');
const { isLoggedIn } = require('../middleware');

// Validation middleware
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map((elem) => elem.message).join(','), 400);
    } else {
        next();
    }
};

router.get('/', catchAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Campground not found.');
        return res.redirect('/campgrounds');
    }
    return res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${camp._id}`);
}));

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Updated Campground Successfully');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground.');
    res.redirect('/campgrounds');
}));

module.exports = router;