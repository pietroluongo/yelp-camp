if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/Campground');

const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.tacau.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('db connected');
});

const getRandomizedItemFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];


const seedDB = async() => {
    await Campground.deleteMany({});
    for (let it = 0; it < 10; it += 1) {
        const rand1k = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[rand1k].city}, ${cities[rand1k].state}`,
            title: `${getRandomizedItemFromArray(descriptors)} ${getRandomizedItemFromArray(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dq6kbbbza/image/upload/v1617893996/YelpCamp/y9DpT_jghr03.jpg',
                    filename: 'YelpCamp/y9DpT_jghr03'
                }
            ],
            description: 'No description provided',
            price: Math.floor(Math.random() * 1000),
            author: '606f1af973dd930015b3f94a',
            geometry: { coordinates: [
                cities[rand1k].longitude,
                cities[rand1k].latitude
            ],
            type: 'Point' }
        });
        await camp.save();
    }
};

seedDB().then(() => {
    console.log('seed successful');
    mongoose.connection.close();
});