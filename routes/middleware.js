const jwt = require('jsonwebtoken');

const accessTokenSecret = 'youraccesstokensecret';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['x-access-token'];
    const token = authHeader;
    console.log("tokenn", token);
    console.log("req.headers['X-Access-Token']", req.headers);
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
};
module.exports = {
    authenticateJWT,
    accessTokenSecret
}