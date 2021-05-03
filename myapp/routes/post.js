var express = require('express');
var router = express.Router();
const middleware = require('./middleware');
const db = require("../model/index");
const Post = db.post;
const Op = db.Sequelize.Op;
const multer = require("multer");
const helpers = require('../helper');
var path = require('path');
/* GET home page. */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

router.get('/', middleware.authenticateJWT, function (req, res, next) {
  res.json('test');
});

router.get('/getOnePost/:id', middleware.authenticateJWT, function (req, res, next) {
  const id = req.params.id
  Post.findByPk(id)
    .then(data => {
      res.json({
        success: true,
        post: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving post with id=" + id
      });
    });
});

router.get('/getAllPost/:page/:limit', middleware.authenticateJWT, function (req, res, next) {
  const page = req.params.page
  const limit = req.params.limit

  console.log('page', page);
  console.log('limit', limit);

  var offset = 0;
  if (parseInt(page, 10) < 2) {
    offset = 0;
  }
  else {
    offset = parseInt(page, 10) - 1;
  }
  console.log('offset', offset);

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


router.post('/createPost', function (req, res, next) {
  let upload = multer({
    storage: storage, limits: { fileSize: 2 * 1024 * 1024 }
  }).single('profile_pic');
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

    let post = {
      title: req.body.title,
      short_description: req.body.short_description,
      link_video: req.body.link_video,
      image_thumbnail: req.file.path,
      seoTitle: req.body.seoTitle,
      createAt: Date.now()
    }

    Post.create(post)
      .then(() => {
        res.json({
          success: true,
          message: "create success"
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the post."
        });
      });
  });


});

router.put('/updatePost/:id', middleware.authenticateJWT, function (req, res, next) {
  const id = req.params.id;
  let upload = multer({ storage: storage, limits: { fileSize: 2 * 1024 * 1024 } }).single('profile_pic');
  upload(req, res, function (err) {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    }
    // else if (!req.file) {
    //   return res.send('Please select an image to upload');
    // }
    else if (err instanceof multer.MulterError) {
      return res.send(err);
    }
    else if (err) {
      return res.send(err);
    }

    let post = {
      title: req.body.title,
      short_description: req.body.short_description,
      link_video: req.body.link_video,
      seoTitle: req.body.seoTitle,
    }

    if (!!req.file) {
      post.image_thumbnail = req.file.path;
    }

    Post.update(post, {
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
            message: `Cannot update Post with id=${id}. Maybe Post was not found or req.body is empty! or the same`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Post with id=" + id
        });
      });
  });
});

router.post('/deletePost/:id', middleware.authenticateJWT, function (req, res, next) {
  const id = req.params.id;
  console.log('req.params.id', req.params.id);

  Post.destroy({
    where: { id: id }
  })
    .then((rowDeleted) => { // rowDeleted will return number of rows deleted
      if (rowDeleted === 1) {
        console.log('rowDeleted', rowDeleted);
        res.json({
          success: true,
          message: 'delete success'
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error delete Post with id=" + id
      });
    });
});

router.get('/search/:keyword', middleware.authenticateJWT, function (req, res, next) {
  let keyword = req.params.keyword

  Post.findAll(
    {
      where: {
        seoTitle: {
          [Op.like]: '%' + keyword + '%'
        }
      }
    }
  )
    .then((data) => {
      res.json({
        success: true,
        posts: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while searching the post."
      });
    });
});

router.get('/sendImagePost/:id', function (req, res, next) {
  const id = req.params.id
  Post.findByPk(id)
    .then(data => {
      res.sendFile(__dirname.replace('routes', data.image_thumbnail));
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving image with id=" + id
      });
    });
});

module.exports = router;
