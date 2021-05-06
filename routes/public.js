var express = require('express');
var router = express.Router();
const db = require("../model/index");
const Image = db.image;
const Post = db.post
const Op = db.Sequelize.Op;

router.get('/get-all-image-gallery', function (req, res, next) {
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
      console.log('err khi get all gallery for enduser');
    });
});

router.get('/get-all-public-posts', function (req, res, next) {
  const page = req.query.page || 1;
  const limit = req.query.limit || 50
  const search = req.query.search || '';

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
            ['id', 'DESC'],
          ],
        }, {
        where: {
          seoTitle: {
            [Op.like]: '%' + search + '%'
          }
        }
      }
      )
        .then((data) => {
          // setTimeout(() => {
          res.json({
            success: true,
            total: length,
            posts: data
          });
          // }, 30000)
        })
        .catch(err => {
          console.log('err khi get all post for enduser');

        });
    })
    .catch(err => {
      console.log('err khi get all post for enduser');

    });
});

router.get('/send-image/:filename', function (req, res, next) {
  const filename = req.params.filename;
  console.log('path: ', __dirname.replace('routes', 'public\\images\\' + filename));
  res.sendFile(__dirname.replace('routes', 'public\\images\\' + filename));
});
module.exports = router;
