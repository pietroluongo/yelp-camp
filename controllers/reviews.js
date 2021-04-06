const Campground = require('../models/Campground');
const Review = require('../models/Review');

module.exports.createReview = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Added review successfully.');
    res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Deleted review successfully.');
    res.redirect(`/campgrounds/${id}/`);
};