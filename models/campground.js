const mongoose = require('mongoose'); // Sets the mongoose constant.
const Review = require('./review'); // Gets the review schema.
const Schema = mongoose.Schema; // Get the mongoose schema.

// Creates a new instance of the CampgroundSchema
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    // Id document exist
    if (doc) {
        // Remove all reviews related to campground
        await Review.deleteMany({
            // find all ID in campground.reviews
            _id: {
                $in: doc.reviews,
            },
        });
    }
});

// Exports the Campground schema to the mongoose model.
module.exports = mongoose.model('Campground', CampgroundSchema);
