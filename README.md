# Yelp-Camp

<div align="center">
    <a href="/">
        <img src="" alt="Yelp-Camp-Banner" crossorigin>
    </a>
</div>
<br />

<div align="center">

[![forthebadge](https://forthebadge.com/images/badges/uses-html.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-css.svg)](https://forthebadge.com)

<br />

![Node](https://img.shields.io/badge/node-v16.16.0-green)
![NPM](https://img.shields.io/badge/npm-v8.11.0-green)
![Express](https://img.shields.io/badge/express-v4.18.1-green)

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/AdamCKW/YelpCamp/graphs/commit-activity)
[![Website](https://img.shields.io/website-down-up-red-green/http/shields.io.svg)]()
[![GitHub license](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)]()

</div>

> TODO: Description of the website

> The source code is open so that you can download the source code and set it up with ease if you would like to have your own exclusive environment.

TODO: ADD GIF HERE

## TODO: Page Screenshots

| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |

## Folder Structure

    .
    ├── models
    ├── public
    |        ├── javascripts
    │        └── stylesheets
    ├── routes
    ├── seeds
    ├── utils
    ├── views
    │        ├── campgrounds
    │        ├── layouts
    │        └── partials
    ├── .gitignore
    ├── index.js
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── schemas.js

## What (Yelp-Camp) ?

Yelp-Camp, is a website of primary made for campground reviews. Users can add and rate campgrounds. You need to have an account in order to review or create a campground. This project was a part of Colt Steele's web development course 2022.

## Why (Yelp-Camp) ?

### Example text

-   The responsive web interface helps you to campground and reviews.
-   You can use source code for your own projects.
-   It works well in low bandwidth environments.

## How to (Wiki) ?

All usage instruction and information update on [Github Wiki](https://github.com/).

## Developing

### Platforms

| Platform          | Status      |
| ----------------- | ----------- |
| Microsoft Windows | Developing  |
| ~~Linux~~         | ~~Pending~~ |
| ~~Mac os~~        | ~~Pending~~ |
| ~~Android~~       | ~~Pending~~ |

#### Built With

-   [Node JS](https://nodejs.org/en/)
-   [Express JS](https://expressjs.com/)
-   [Mongodb](https://www.mongodb.com/)

#### Clone Project

```shell
git clone https://github.com/AdamCKW/YelpCamp.git
```

==Git Clone GIF==

This Command will copy a full project to your local environment

## Node Server

### Setting up Node Server

```shell
cd YelpCamp
npm i
```

`cd YelpCamp` Move into Node Project Folder
`npm i` install all dependency.

### Run Node Project

Run `node index.js` to start node server.
Go to `localhost:3000` to use the website at local environment.

## Database

MongoDB is used as Database.

### Starting MongoDB

Run `mongod` in another terminal and `mongosh` to use MongoDB shell.

## API

### Cloudinary Storage API

Create a `.env` file in the main directory.
Add your API information in the newly created file.

```
CLOUDINARY_CLOUD_NAME= #your API Cloud Name
CLOUDINARY_API_KEY= #your API Key
CLOUDINARY_API_SECRET= #your API Secret
```

## How to tweak this project for your own uses

Since this is a simple project, I would encourage you to clone and rename this project for your own purpose.

## Find a bug?

If you found an issue or would like to submit an improvement to this project, please submit an issue using the issues tab above. If you like to submit a PR with a fix, reference the issue you created.
