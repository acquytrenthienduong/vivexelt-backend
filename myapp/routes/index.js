var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const db = require("../model/index");
const User = db.user;
const Post = db.post;
const bcrypt = require('bcrypt');

const accessTokenSecret = 'youraccesstokensecret';

function generateAccessToken(username) {
  return jwt.sign(username, accessTokenSecret, { expiresIn: '7d' });
}

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })

};

router.get('/', authenticateJWT, function (req, res, next) {
  User.findAll()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while user"
      });
    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ where: { username: username } })
    .then(data => {
      if (!data) {
        res.status(401).send({
          message: "not found."
        });
      }

      bcrypt.compare(password, data.password)
        .then((valid) => {
          if (!valid) {
            res.status(402).send({
              message: "not found"
            });
          }
          else {
            // Generate an access token
            const token = generateAccessToken({ username: username });
            res.json({
              token
            });
          }
        })
    })
});

router.post('/create', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password.toString(), 10)
    .then((hash) => {
      let user = {
        username: username,
        password: hash,
      };

      User.create(user)
        .then(() => {
          res.send({
            message: 'create success'
          })
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the user."
          });
        });
    })
})

router.get('/getOnePost/:id', authenticateJWT, function (req, res, next) {
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

router.get('/getAllPost', authenticateJWT, function (req, res, next) {
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

router.post('/createPost', authenticateJWT, function (req, res, next) {
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

router.post('/updatePost/:id', authenticateJWT, function (req, res, next) {
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

router.post('/deletePost/:id', authenticateJWT, function (req, res, next) {
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
