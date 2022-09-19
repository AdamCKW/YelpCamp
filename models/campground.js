const mongoose = require('mongoose'); // Sets the mongoose constant.
const Schema = mongoose.Schema; // Get the mongoose schema.

// Creates a new instance of the constCampgroundSchema
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
});

// Exports the Campground schema to the mongoose model.
module.exports = mongoose.model('Campground', CampgroundSchema);
