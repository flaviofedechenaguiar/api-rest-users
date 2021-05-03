let jwt = require('jsonwebtoken');
module.exports =
    (req, res, next) => {
        let returnedToken = req.headers['authorization'];
        let bearer = returnedToken.split(' ');
        let token = bearer[1];
        jwt.verify(token, 'secrectjwt1234', (err, data) => {
            if (!err) {
                next();
            } else {
                return res.status(401).json({ code: 401, error: 'Token inválido' });
            }
        })
    }