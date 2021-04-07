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
                    url: 'https://res.cloudinary.com/dq6kbbbza/image/upload/v1617796268/YelpCamp/wv9ouza71vkjmzhmtyl9.png',
                    filename: 'YelpCamp/wv9ouza71vkjmzhmtyl9'
                },
                {
                    url: 'https://res.cloudinary.com/dq6kbbbza/image/upload/v1617796268/YelpCamp/jovlaoxs4dpzm9vmcihy.png',
                    filename: 'YelpCamp/jovlaoxs4dpzm9vmcihy'
                }
            ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            price: Math.floor(Math.random() * 1000),
            author: '606c3ca0497e9211208aabf2',
            geometry: { coordinates: [
                -46.660603,
                -23.555376
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