const express = require('express');
const path = require('path');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');
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
})

const getRandomizedItemFromArray = (arr) => (arr[Math.floor (Math.random() * arr.length)]);


const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const rand1k = Math.floor(Math.random()*1000);
        const camp = new Campground({
            location: `${cities[rand1k].city}, ${cities[rand1k].state}`,
            title: `${getRandomizedItemFromArray(descriptors)} ${getRandomizedItemFromArray(places)}`
        });
        await camp.save();
    }
}

seedDB().then(() => {
    console.log('seed successful');
    mongoose.connection.close();
})