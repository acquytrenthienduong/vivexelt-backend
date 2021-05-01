var express = require('express');
var router = express.Router();
const middleware = require('./middleware');
const db = require("../model/index");
const Post = db.post;

/* GET home page. */
router.get('/', middleware.authenticateJWT, function (req, res, next) {
  res.json('test');
});

router.get('/getOnePost/:id', middleware.authenticateJWT, function (req, res, next) {
  const id = req.params.id
  Post.findByPk(id)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving post with id=" + id
      });
    });
});

router.get('/getAllPost', middleware.authenticateJWT, function (req, res, next) {
  Post.findAll()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while post"
      });
    });
});

router.post('/createPost', middleware.authenticateJWT, function (req, res, next) {
  let post = {
    title: req.body.title,
    description: req.body.description,
    linkvideo: req.body.linkvideo,
  }

  Post.create(post)
    .then(() => {
      res.status(200).send({ message: 'create success' });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the post."
      });
    });
});

router.post('/updatePost/:id', middleware.authenticateJWT, function (req, res, next) {
  const id = req.params.id;
  Post.update(req.body.post, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Post was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Post with id=${id}. Maybe Post was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Post with id=" + id
      });
    });
});

router.post('/deletePost/:id', middleware.authenticateJWT, function (req, res, next) {
  const id = req.params.id;
  Post.destroy({
    where: { id: id }
  })
    .then((rowDeleted) => { // rowDeleted will return number of rows deleted
      if (rowDeleted === 1) {
        res.send({
          message: "Post was deleted."
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error delete Post with id=" + id
      });
    });
});

module.exports = router;
