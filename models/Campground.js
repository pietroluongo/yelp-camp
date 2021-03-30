const mongoose = require('mongoose');
const Review = require('./Review');
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

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
    console.log(doc);
});

module.exports = mongoose.model('Campground', CampgroundSchema);