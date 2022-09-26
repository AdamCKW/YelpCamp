/* Importing the cloudinary package and assigning it to the variable cloudinary. */
const cloudinary = require('cloudinary').v2;
/* Importing the CloudinaryStorage class from the multer-storage-cloudinary package. */
const { CloudinaryStorage } = require('multer-storage-cloudinary');

/* Setting the cloudinary configuration. */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* Creating a new instance of the CloudinaryStorage class and assigning 
it to the variable storage. */
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormat: ['jpeg', 'png', 'jpg'],
    },
});

/* Exporting the cloudinary and storage variables 
so that they can be used in other files. */
module.exports = {
    cloudinary,
    storage,
};
