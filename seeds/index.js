const express = require('express');
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

// Establishes a connection to MongoDB.
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection; // Creates a mongoose database connection.
db.on('error', console.error.bind(console, 'Connection Error:')); // Called when a connection error occurs.
// Opens the database.
db.once('open', () => {
    console.log('Database Connected');
});

// Generates a random sample from the array.
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    // Create a new campground.
    for (let i = 0; i < 50; i++) {
        // Create a campground with a random city, state, title.
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque dolores amet expedita id eligendi corporis cum maxime culpa, quos, laudantium necessitatibus reprehenderit magnam impedit quo! Unde sequi fugit nemo vero.',
            price,
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
