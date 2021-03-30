const express = require('express');
const router = new express.Router();
const Campground = require('../models/Campground');
const { campgroundSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const { ExpressError } = require('../utils/ExpressError');

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

router.get('/new', catchAsync((req, res) => {
    res.render('campgrounds/new');
}));

router.get('/:id', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

router.post('/', validateCampground, catchAsync(async (req, res) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}));

router.put('/:id', validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

module.exports = router;