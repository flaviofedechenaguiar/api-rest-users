const User = require('../models/user.model.js');
const { Op } = require('sequelize');

module.exports = {
    findUsers: async (req, res) => {
        let { dataUser } = req.query;
        let where = {};
        if (dataUser != undefined) {
            where = {
                where: {
                    [Op.or]: [{ name: dataUser }, { lastName: dataUser }]
                }
            }
        }
        try {
            let users = await User.findAll(where);
            return res.status(200).json({ code: 200, users });
        } catch (err) {
            return res.status(500).json({ code: 500, error: 'Erro ao consultar a base de dados' });
        }
    },
    createUser: async (req, res) => {
        let { name, lastName, nickname, address, bio } = req.body;
        if (name == undefined || name == '') {
            return res.status(400).json({ code: 400, error: 'Necessário o preenchimento do nome' });
        }
        if (lastName == undefined || lastName == '') {
            return res.status(400).json({ code: 400, error: 'Necessário o preenchimento do sobrenome' })
        }
        if (nickname == undefined || nickname == '') {
            return res.status(400).json({ code: 400, error: 'Necessário o preenchimento do nickname' });
        }
        if (nickname.length > 30) {
            return res.status(400).json({ code: 400, error: 'Máximo permitido são 30 caracteres para o nickname' });
        }
        if (address == undefined || address == '') {
            return res.status(400).json({ code: 400, error: 'Necessário o preenchimento do endereço' });
        }
        if (bio == undefined || bio == '') {
            bio = '';
        }
        if (bio.length > 100) {
            return res.status(400).json({ code: 400, error: 'Máximo permitido são 100 caracteres para a bio' });
        }

        try {

            let findUser = await User.findOne({
                where: { nickname: { [Op.eq]: nickname } }
            });

            if (findUser == null) {
                let user = await User.create({ name, lastName, nickname, address, bio });
                return res.status(201).json({ code: 201, message: 'Criado com sucesso', user_data: user });
            } else {
                return res.status(400).json({ code: 400, message: 'nickname já presente' });
            }
        } catch (err) {
            return res.status(500).json({ code: 500, error: 'Erro ao fazer cadastro na base de dados' });
        }
    },
    findUserByNickname: async (req, res) => {
        let { nickname } = req.params;
        try {
            let user = await User.findOne({
                where: { nickname: { [Op.eq]: nickname } }
            });

            if (user != null) {
                return res.status(200).json({
                    code: 200,
                    user_data: {
                        name: user.name,
                        lastName: user.lastName,
                        nickname: user.nickname
                    }
                });
            } else {
                return res.status(200).json({
                    code: 200,
                    user_data: {
                        name: '',
                        lastName: '',
                        nickname: ''
                    }
                });
            }
        } catch (err) {
            return res.status(500).json({ code: 500, error: 'Erro ao fazer consulta na base de dados' });
        }
    },
    deleteUser: async (req, res) => {
        let { id } = req.params;
        try {
            await User.destroy({ where: { id } });
            return res.status(200).json({ code: 200 });
        } catch (err) {
            return res.status(500).json({ code: 500, error: 'Erro ao fazer deleção na base de dados' });
        }
    },
    updateUserPartial: async (req, res) => {
        let { id } = req.params;
        let { name, lastName, nickname, address, bio } = req.body;
        let userObject = {};
        if (name != undefined) {
            userObject.name = name;
        }
        if (lastName != undefined) {
            userObject.lastName = lastName;
        }
        if (nickname != undefined) {
            userObject.nickname = nickname;
        }
        if (address != undefined) {
            userObject.address = address
        }
        if (bio != undefined) {
            userObject.bio = bio;
        }
        if (userObject.name == '') {
            return res.status(400).json({ code: 400, error: 'Necessário o preenchimento do nome' });
        }
        if (userObject.lastName == '') {
            return res.status(400).json({ code: 400, error: 'Necessário o preenchimento do sobrenome' });
        }
        if (userObject.nickname == '') {
            return res.status(400).json({ code: 400, error: 'Necessário o preenchimento do nickname' });
        }
        if (userObject.nickname != undefined && userObject.nickname.length > 30) {
            return res.status(400).json({ code: 400, error: 'Máximo permitido são 30 caracteres para o nickname' });
        }
        if (userObject.address == '') {
            return res.status(400).json({ code: 400, error: 'Necessário o preenchimento do endereço' });
        }
        if (userObject.bio != undefined && userObject.bio.length > 100) {
            return res.status(400).json({ code: 400, error: 'Máximo permitido são 100 caracteres para a bio' });
        }

        try {
            let userPresent = await User.findOne({
                where: {
                    [Op.and]: [{ id: { [Op.ne]: id } }, { nickname: { [Op.eq]: nickname } }]
                }
            });
            if (userPresent != null) {
                return res.status(400).json({ code: 400, error: 'Nickname presente no sistema' });
            }

            let userUpdated = await User.update(userObject, { where: { id: { [Op.eq]: id } } });
            if (Number(userUpdated)) {
                let userFind = await User.findOne({ where: { id: { [Op.eq]: id } } });
                return res.status(200).json(userFind);
            } else {
                return res.status(200).json({
                    code: 200,
                    user_data: {
                        name: '',
                        lastName: '',
                        nickname: '',
                        address: '',
                        bio: '',
                        createdAt: '',
                        updatedAt: ''
                    }
                });
            }
        } catch (err) {
            return res.status(500).json({ code: 500, error: 'Erro ao fazer atualização na base de dados' });
        }
    }
}