const express = require('express');
const path = require('path');
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
    for (let it = 0; it < 50; it += 1) {
        const rand1k = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[rand1k].city}, ${cities[rand1k].state}`,
            title: `${getRandomizedItemFromArray(descriptors)} ${getRandomizedItemFromArray(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            price: Math.floor(Math.random() * 1000)
        });
        await camp.save();
    }
};

seedDB().then(() => {
    console.log('seed successful');
    mongoose.connection.close();
});