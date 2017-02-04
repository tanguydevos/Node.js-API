"use strict";

var jwt = require('jsonwebtoken');

module.exports = function(options) {
    if (!options || !options.secret) {
        throw new Error('Authenticate : secret should be set.');
    }
    return (function(req, res, next) {
        // Check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // Decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, options.secret, function(err, decoded) {
                if (err) {
                    if (err.name === "JsonWebTokenError") {
                        return res.status(401).send({
                            success: false,
                            message: 'Failed to authenticate token.'
                        });
                    } else if (err.name === "TokenExpiredError") {
                        return res.status(401).send({
                            success: false,
                            message: 'Token is expired.'
                        });
                    }
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            // if there is no token
            // return an HTTP response of 403 (access forbidden) and an error message
            return res.status(403).json({
                success: false,
                message: 'No token provided.'
            });
        }
    });
};