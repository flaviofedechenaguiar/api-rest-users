const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const { Op } = require('sequelize');
JWT_SECRET = process.env.JWT_SECRET;
module.exports = {
    authentication: async (req, res) => {
        let { nickname } = req.body;
        try {
            if (nickname == undefined || nickname == '') {
                throw { code: 401, error: 'Nickname inválido' };
            }
            let user = await User.findOne({ where: { nickname: { [Op.eq]: nickname } } });
            if (user != null) {
                let returnData = { nickname: user.nickname, name: user.name, id: user.id };
                let token = jwt.sign(returnData, JWT_SECRET, { expiresIn: '48h' });
                return res.status(200).json({ token });
            } else {
                throw { code: 401, error: 'Nickname inválido' };
            }
        } catch (err) {
            if (err.code && err.error) {
                return res.status(err.code).json({ code: err.code, error: err.error });
            } else {
                return res.status(500).json({ code: 500, error: 'Ocorreou algum erro enquanto gerava o token' });
            }
        }


    }
}