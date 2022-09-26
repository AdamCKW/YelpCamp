const express = require('express');
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

/* It establishes a connection to MongoDB. */
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

/**
 * Return a random element from the given array.
 * @param array - The array to sample from.
 */
const sample = (array) => array[Math.floor(Math.random() * array.length)];

/**
 * It creates 50 campgrounds, each with a random location, title, image, description, and price.
 */
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '632ffeaaeddf0b8c1ef2ecda',
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

/* Closing the connection to the database. */
seedDB().then(() => {
    mongoose.connection.close();
});
