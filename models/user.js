const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

/* Creating a new schema for the user. */
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});
/*  Passport-Local Mongoose will add a username, hash and salt field 
to store the username, the hashed password and the salt value.
Additionally Passport-Local Mongoose adds some methods to your Schema.*/
UserSchema.plugin(passportLocalMongoose);

/* Exporting the model to be used in other files. */
module.exports = mongoose.model('User', UserSchema);
