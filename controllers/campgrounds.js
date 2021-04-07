const Campground = require('../models/Campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });


module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
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
    return res.redirect(`/campgrounds/${camp._id}`);
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
    if (req.body.deleteImages) {
        req.body.deleteImages.map(async (img) => {
            await cloudinary.uploader.destroy(img);
        });
        await campground.updateOne({
            $pull: {
                images: {
                    filename: {
                        $in: req.body.deleteImages
                    }
                }
            }
        });
        console.log(campground);
    }
    req.flash('success', 'Updated Campground Successfully');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground.');
    res.redirect('/campgrounds');
};