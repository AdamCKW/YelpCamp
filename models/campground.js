const mongoose = require('mongoose'); // Sets the mongoose constant.
const Review = require('./review'); // Gets the review schema.
const Schema = mongoose.Schema; // Get the mongoose schema.

// https://res.cloudinary.com/dyt1cqiyq/image/upload/w_300/v1664358122/YelpCamp/lg7meavz8lr5ubkoxv55.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

/* Creating a virtual field called thumbnail that will 
return the url of the image with the width of 200px. */
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

// Creates a new instance of the CampgroundSchema
const CampgroundSchema = new Schema(
    {
        title: String,
        images: [ImageSchema],
        price: Number,
        description: String,
        location: String,
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review',
            },
        ],
    },
    opts
);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});

/* Deleting all reviews related to the campground. */
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
