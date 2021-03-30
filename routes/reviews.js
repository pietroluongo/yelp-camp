const express = require('express');
const { reviewSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/Campground');
const Review = require('../models/Review');

const router = new express.Router({ mergeParams: true });


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map((elem) => elem.message).join(','), 400);
    } else {
        next();
    }
};

router.post('/', validateReview, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campgrounds/${id}/`);
}));

module.exports = router;