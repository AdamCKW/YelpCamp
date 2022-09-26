const mongoose = require('mongoose'); // Sets the mongoose constant.
const Schema = mongoose.Schema; // Sets the mongoose.Schema.

// Creates a new instance of the reviewSchema
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

// Sets the exports for the review model.
module.exports = mongoose.model('Review', reviewSchema);
