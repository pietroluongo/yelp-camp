const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/Campground');
const Review = require('../models/Review');
const { validateReview } = require('../middleware');

const router = new express.Router({ mergeParams: true });

router.post('/', validateReview, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Added review successfully.');
    res.redirect(`/campgrounds/${camp._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Deleted review successfully.');
    res.redirect(`/campgrounds/${id}/`);
}));

module.exports = router;