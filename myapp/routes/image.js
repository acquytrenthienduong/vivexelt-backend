var express = require('express');
var router = express.Router();
const middleware = require('./middleware');
const multer = require("multer");
const helpers = require('../helper');
const db = require("../model/index");
const Image = db.image;
var path = require('path');

// const db = require("../model/index");
// const Post = db.post;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('upload.ejs');
});

router.get('/getOne/:id', middleware.authenticateJWT, function (req, res, next) {
    const id = req.params.id
    Image.findByPk(id)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving image with id=" + id
            });
        });
});

router.get('/getAllImage', middleware.authenticateJWT, function (req, res, next) {
    Image.findAll()
        .then((data) => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while Image"
            });
        });
});



router.post('/upload-one', (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');
    upload(req, res, function (err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation

        let image = {
            path: req.file.path
        }
        Image.create(image)
            .then(() => {
                res.status(200).send({ message: 'create success' });

            }).catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the post."
                });
            });
        res.send(`You have uploaded this image: <hr/><img src="${req.file.path.slice(7)}" width="500"><hr /><a href="./">Upload another image</a>`);
    });
});

router.post('/upload-multiple', (req, res) => {
    // 10 is the limit I've defined for number of uploaded files at once
    // 'multiple_images' is the name of our file input field
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).array('multiple_images', 10);

    upload(req, res, function (err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        let result = "You have uploaded these images: <hr />";
        const files = req.files;
        let index, len;

        // Loop through all the uploaded images and display them on frontend
        for (index = 0, len = files.length; index < len; ++index) {
            let image = {
                path: files[index].path
            }
            Image.create(image)
                .then(() => {
                    res.status(200).send({ message: 'create success' });

                }).catch((err) => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the post."
                    });
                });
            result += `<img src="${files[index].path.slice(7)}" width="300" style="margin-right: 20px;">`;
        }
        result += '<hr/><a href="./">Upload more images</a>';
        res.send(result);
    });
});

router.post('/updateImage/:id', middleware.authenticateJWT, function (req, res, next) {
    const id = req.params.id;
    Image.update(req.body.image, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Image was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Image with id=${id}. Maybe Image was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Image with id=" + id
            });
        });
});

router.post('/deleteImage/:id', middleware.authenticateJWT, function (req, res, next) {
    const id = req.params.id;
    Image.destroy({
        where: { id: id }
    })
        .then((rowDeleted) => { // rowDeleted will return number of rows deleted
            if (rowDeleted === 1) {
                res.send({
                    message: "Image was deleted."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error delete Image with id=" + id
            });
        });
});
module.exports = router;
