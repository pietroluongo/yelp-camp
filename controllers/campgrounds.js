const Campground = require('../models/Campground');

module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
    const camp = new Campground(req.body.campground);
    camp.images = req.files.map((file) => (
        {
            url: file.path,
            filename: file.filename
        }
    ));
    camp.author = req.user._id;
    await camp.save();
    console.log(camp);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.showCampground = async(req, res) => {
    const campground = await Campground
        .findById(req.params.id)
        .populate({ path: 'reviews',
            populate: {
                path: 'author'
            } })
        .populate('author');
    if (!campground) {
        req.flash('error', 'Campground not found.');
        return res.redirect('/campgrounds');
    }
    return res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground not found.');
        return res.redirect('/campgrounds');
    }
    return res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const images = req.files.map((file) => (
        {
            url: file.path,
            filename: file.filename
        }
    ));
    campground.images.push(...images);
    await campground.save();
    req.flash('success', 'Updated Campground Successfully');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground.');
    res.redirect('/campgrounds');
};