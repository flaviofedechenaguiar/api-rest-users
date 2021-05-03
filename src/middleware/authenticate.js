let jwt = require('jsonwebtoken');
JWT_SECRET = process.env.JWT_SECRET;
module.exports =
    (req, res, next) => {
        let returnedToken = req.headers['authorization'];
        let bearer = returnedToken.split(' ');
        let token = bearer[1];
        jwt.verify(token, JWT_SECRET, (err, data) => {
            if (!err) {
                next();
            } else {
                return res.status(401).json({ code: 401, error: 'Token inválido' });
            }
        })
    }