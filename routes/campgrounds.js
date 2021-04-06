const express = require('express');
const router = new express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const {
    index,
    renderNewForm,
    showCampground,
    createCampground,
    renderEditForm,
    deleteCampground,
    updateCampground
} = require('../controllers/campgrounds');

router.get('/', catchAsync(index));
router.get('/new', isLoggedIn, renderNewForm);
router.get('/:id', catchAsync(showCampground));
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(renderEditForm));
router.post('/', isLoggedIn, validateCampground, catchAsync(createCampground));
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(updateCampground));
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(deleteCampground));

module.exports = router;