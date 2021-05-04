var express = require('express');
var router = express.Router();
const db = require("../model/index");
const Image = db.image;
const Post = db.post

router.get('/getAllImage', function (req, res, next) {
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

router.get('/getAllPost/:page/:limit', function (req, res, next) {
    const page = req.params.page
    const limit = req.params.limit

    var offset = 0;
    if (parseInt(page, 10) < 2) {
        offset = 0;
    }
    else {
        offset = parseInt(page, 10) - 1;
    }
    Post.findAll({})
        .then((data) => {
            const length = data.length
            Post.findAll(
                {
                    offset: offset * parseInt(limit, 10),
                    limit: parseInt(limit, 10),
                    order: [
                        ['createAt', 'DESC'],
                    ],
                }
            )
                .then((data) => {
                    res.json({
                        success: true,
                        total: length,
                        posts: data
                    });
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while post"
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while post"
            });
        });
});

module.exports = router;
