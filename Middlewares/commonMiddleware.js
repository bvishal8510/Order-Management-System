const jwt = require('jsonwebtoken');
const config = require('config');
const { messages } = require('../constants');

function verifyToken(req, res, next) {
    try {
        let token = req.cookies['x-auth-token'];

        if (!token) return res.status(401).json({ message: messages.BAD_REQUEST, error: 'No token provided!!'});

        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.id = decoded._id;
        req.role = decoded.role;
        next();
    }
    catch (err) {
        return res.status(400).json({ message: messages.BAD_REQUEST, error: 'Invalid Token!!'});
    }
}

module.exports = {
    verifyToken
}
