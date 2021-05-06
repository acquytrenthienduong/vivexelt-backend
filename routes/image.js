var express = require('express');
var router = express.Router();
const middleware = require('./middleware');
const multer = require("multer");
const helpers = require('../helper');
const db = require("../model/index");
const Image = db.image;
const path = require('path');

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

router.get('/get-one/:id', middleware.authenticateJWT, function (req, res, next) {
    const id = req.params.id
    Image.findByPk(id)
        .then(data => {
            res.json({
                success: true,
                gallery: data
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving image with id=" + id
            });
        });
});

router.get('/get-all-image', middleware.authenticateJWT, function (req, res, next) {
    Image.findAll({
        order: [
            ['position', 'ASC'],
        ],
    })
        .then((data) => {

            res.json({
                success: true,
                gallerys: data
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while Image"
            });
        });
});

router.post('/upload-one', (req, res) => {
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter, limits: { fileSize: 2 * 1024 * 1024 } }).single('vivexelt_pic');
    upload(req, res, function (err) {

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

        let image = {
            path: req.file.path,
            position: req.body.position,
            filename: req.file.filename.split('.')[0],
            createAt: Date.now()
        }
        Image.create(image)
            .then(() => {
                res.json({
                    success: true,
                    message: "create success"
                });
            }).catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the post."
                });
            });
    });
});

router.post('/upload-multiple', (req, res) => {
    // 10 is the limit I've defined for number of uploaded files at once
    // 'multiple_images' is the name of our file input field
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter, limits: { fileSize: 2 * 1024 * 1024 } }).array('multiple_images', 10);

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

router.put('/update-image/:id', middleware.authenticateJWT, function (req, res, next) {
    const id = req.params.id;
    let upload = multer({ storage: storage, limits: { fileSize: 2 * 1024 * 1024 } }).single('vivexelt_pic');
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

        let image = {
            position: req.body.position,
            // createAt: Date.now()
        }

        if (!!req.file) {
            image.path = req.file.path;
            image.filename = req.file.filename.split('.')[0];
        }

        Image.update(image, {
            where: { id: id }
        })
            .then(num => {
                if (num == 1) {
                    res.json({
                        success: true,
                        message: "create success"
                    });
                } else {
                    res.json({
                        success: false,
                        message: `Cannot update Image with id=${id}. Maybe Image was not found or req.body is empty! or the same`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating Image with id=" + id
                });
            });
    });
});

router.post('/delete-image/:id', middleware.authenticateJWT, function (req, res, next) {
    const id = req.params.id;
    Image.destroy({
        where: { id: id }
    })
        .then((rowDeleted) => { // rowDeleted will return number of rows deleted
            if (rowDeleted === 1) {
                res.json({
                    success: true,
                    message: 'delete success'
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error delete Image with id=" + id
            });
        });
});

router.get('/send-image/:filename', function (req, res, next) {
    const filename = req.params.filename
    Image.findOne({
        where: {
            filename: filename
        }
    })
        .then(data => {
            res.sendFile(__dirname.replace('routes', data.path));
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving image with id=" + id
            });
        });
});
module.exports = router;
