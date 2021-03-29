const mongoose = require('mongoose');
const { Schema } = mongoose;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    location: String,
    description: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('Campground', CampgroundSchema);