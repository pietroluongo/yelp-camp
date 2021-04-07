const express = require('express');
const router = new express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });
const {
    index,
    renderNewForm,
    showCampground,
    // CreateCampground,
    renderEditForm,
    deleteCampground,
    updateCampground
} = require('../controllers/campgrounds');

router.get('/new', isLoggedIn, renderNewForm);

router.route('/')
    .get(catchAsync(index))
    // .post(isLoggedIn, validateCampground, catchAsync(createCampground));
    .post(upload.single('image'), (req, res) => {
        res.send(req.body, req.file);
    });

router.route('/:id')
    .get(catchAsync(showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(renderEditForm));

module.exports = router;