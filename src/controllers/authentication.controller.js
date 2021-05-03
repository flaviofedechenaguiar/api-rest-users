const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const { Op } = require('sequelize');
module.exports = {
    authentication: async (req, res) => {
        let { nickname } = req.body;
        if (nickname == undefined || nickname == '') {
            return res.status(403).json({ error: 'Nickname inválido' });
        }
        try {
            let user = await User.findOne({ where: { nickname: { [Op.eq]: nickname } } });
            if (user != null) {
                let token = jwt.sign({
                    nickname: user.nickname, name: user.name, id: user.id
                }, 'secrectjwt1234', { expiresIn: '48h' });
                return res.status(200).json({ token });
            } else {
                return res.status(403).json({ error: 'Nickname inválido' });
            }
        } catch (err) {
            return res.status(500).json({ code: 500, error: 'Ocorreou algum erro enquanto gerava o token' });
        }
    }
}