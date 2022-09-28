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
            // Your User ID
            author: '6331c106e2d8245bd7ab8a90',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: { type: 'Point', coordinates: [-113.133115, 47.020078] },
            title: `${sample(descriptors)} ${sample(places)}`,
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque dolores amet expedita id eligendi corporis cum maxime culpa, quos, laudantium necessitatibus reprehenderit magnam impedit quo! Unde sequi fugit nemo vero.',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt',
                },
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi',
                },
            ],
        });
        await camp.save();
    }
};

/* Closing the connection to the database. */
seedDB().then(() => {
    mongoose.connection.close();
});
