var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const db = require("../model/index");
const User = db.user;
const bcrypt = require('bcrypt');
const middleware = require('./middleware');
// const accessTokenSecret = 'youraccesstokensecret';

function generateAccessToken(username) {
  return jwt.sign(username, middleware.accessTokenSecret, { expiresIn: '7d' });
}

// const authenticateJWT = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) return res.sendStatus(401)

//   jwt.verify(token, accessTokenSecret, (err, user) => {
//     if (err) return res.sendStatus(403)
//     req.user = user
//     next()
//   })
// };

router.get('/', middleware.authenticateJWT, function (req, res, next) {
  User.findAll()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err);

    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('req.body', req.body);
  console.log('username', req.body.username);
  console.log('password', req.body.password);

  User.findOne({ where: { username: username } })
    .then(data => {
      if (!data) {
        res.status(401).send({
          message: "account not found"
        });
      }

      bcrypt.compare(password, data.password)
        .then((valid) => {
          if (!valid) {
            res.status(402).send({
              message: "incorrect password"
            });
          }
          else {
            // Generate an access token
            const token = generateAccessToken({ username: username });
            res.json({
              success: true,
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
          console.log(err);

        });
    })
})

module.exports = router;
