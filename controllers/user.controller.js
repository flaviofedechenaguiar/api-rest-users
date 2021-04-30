const User = require('../models/user.model.js');
const { Op } = require('sequelize');

class HATEOAS {
    constructor(url) {
        this.url = url;
    }
    getHATEOAS(params, method, rel) {
        return {
            href: `${this.url}${params}`,
            method: method,
            rel: rel
        }
    }
}

class userErrorResponse {
    constructor(responseCode, responseError) {
        this.responseCode = responseCode;
        this.responseError = responseError;
    }
    get code() {
        return this.responseCode;
    }
    get error() {
        return this.responseError;
    }
}

module.exports = {
    findUsers: async (req, res) => {
        let { dataUser } = req.query;
        let where = {};
        if (dataUser != undefined) {
            where = {
                where: {
                    [Op.or]: [{ name: { [Op.eq]: dataUser } }, { lastName: { [Op.eq]: dataUser } }]
                }
            }
        }
        try {
            let users = await User.findAll(where);
            let hateOAS = new HATEOAS('http://localhost:3030/users');
            users = users.map(user => user = {
                ...user.dataValues, _links: [
                    hateOAS.getHATEOAS(`?dataUser=${user.name}`, 'GET', 'get_users_name'),
                    hateOAS.getHATEOAS(`?dataUser=${user.lastName}`, 'GET', 'get_users_last_name'),
                    hateOAS.getHATEOAS(`/${user.nickname}`, 'GET', 'get_user_nickname'),
                    hateOAS.getHATEOAS(`/${user.id}`, 'PATCH', 'update_user'),
                    hateOAS.getHATEOAS(`/${user.id}`, 'DELETE', 'delete_user')
                ]
            });
            return res.status(200).json({ code: 200, users });
        } catch (err) {
            return res.status(500).json({ code: 500, error: 'Erro ao consultar a base de dados' });
        }
    },
    createUser: async (req, res) => {
        let { name, lastName, nickname, address, bio } = req.body;
        try {

            if (name == undefined || name == '') {
                throw new userErrorResponse(400, 'Necessário o preenchimento do nome');
            }
            if (lastName == undefined || lastName == '') {
                throw new userErrorResponse(400, 'Necessário o preenchimento do sobrenome');
            }
            if (nickname == undefined || nickname == '') {
                throw new userErrorResponse(400, 'Necessário o preenchimento do nickname');
            }
            if (nickname.length > 30) {
                throw new userErrorResponse(400, 'Máximo permitido são 30 caracteres para o nickname');
            }
            if (address == undefined || address == '') {
                throw new userErrorResponse(400, 'Necessário o preenchimento do endereço');
            }
            if (bio == undefined || bio == '') {
                bio = '';
            }
            if (bio.length > 100) {
                throw new userErrorResponse(400, 'Máximo permitido são 100 caracteres para a bio');
            }

            let findUser = await User.findOne({
                where: { nickname: { [Op.eq]: nickname } }
            });

            if (findUser == null) {
                let user = await User.create({ name, lastName, nickname, address, bio });

                let hateOAS = new HATEOAS('http://localhost:3030/users');
                user.dataValues['_links'] = [
                    hateOAS.getHATEOAS(`?dataUser=${user.name}`, 'GET', 'get_users_name'),
                    hateOAS.getHATEOAS(`?dataUser=${user.lastName}`, 'GET', 'get_users_last_name'),
                    hateOAS.getHATEOAS(`/${user.nickname}`, 'GET', 'get_user_nickname'),
                    hateOAS.getHATEOAS(`/${user.id}`, 'PATCH', 'update_user'),
                    hateOAS.getHATEOAS(`/${user.id}`, 'DELETE', 'delete_user')
                ]

                return res.status(201).json({ code: 201, message: 'Criado com sucesso', user_data: user });
            } else {
                throw new userErrorResponse(400, 'nickname já presente');
            }

        } catch (err) {
            if (err instanceof TypeError) {
                return res.status(500).json({ code: 500, error: 'Erro ao fazer cadastro na base de dados' });
            } else {
                return res.status(err.code).json({ code: err.code, error: err.error });
            }
        }
    },
    findUserByNickname: async (req, res) => {
        let { nickname } = req.params;
        try {
            let user = await User.findOne({
                where: { nickname: { [Op.eq]: nickname } }
            });
            if (user != null) {

                let hateOAS = new HATEOAS('http://localhost:3030/users');
                user['_links'] = [
                    hateOAS.getHATEOAS(`?dataUser=${user.name}`, 'GET', 'get_users_name'),
                    hateOAS.getHATEOAS(`?dataUser=${user.lastName}`, 'GET', 'get_users_last_name'),
                    hateOAS.getHATEOAS(`/${user.id}`, 'PATCH', 'update_user'),
                    hateOAS.getHATEOAS(`/${user.id}`, 'DELETE', 'delete_user')
                ]

                return res.status(200).json({
                    code: 200,
                    user_data: {
                        name: user.name,
                        lastName: user.lastName,
                        nickname: user.nickname,
                        _links: user._links
                    }
                });
            } else {
                return res.status(202).json({
                    code: 202,
                    user_data: { name: '', lastName: '', nickname: '', _links: [] }
                });
            }
        } catch (err) {
            return res.status(500).json({ code: 500, error: 'Erro ao fazer consulta na base de dados' });
        }
    },
    deleteUser: async (req, res) => {
        let { id } = req.params;
        try {
            let userDeleted = await User.destroy({ where: { id } });
            if (Number(userDeleted)) {
                return res.status(200).json({ code: 200 });
            } else {
                return res.status(202).json({ code: 202 });
            }
        } catch (err) {
            return res.status(500).json({ code: 500, error: 'Erro ao deletar da base de dados' });
        }
    },
    updateUserPartial: async (req, res) => {
        let { id } = req.params;
        let { name, lastName, nickname, address, bio } = req.body;
        let userObject = {};

        userObject.name = (name != undefined) ? name : undefined;
        userObject.lastName = (lastName != undefined) ? lastName : undefined;
        userObject.nickname = (nickname != undefined) ? nickname : undefined;
        userObject.address = (address != undefined) ? address : undefined;
        userObject.bio = (bio != undefined) ? bio : undefined;

        try {

            if (userObject.name == '') {
                throw new userErrorResponse(400, 'Necessário o preenchimento do nome');
            }
            if (userObject.lastName == '') {
                throw new userErrorResponse(400, 'Necessário o preenchimento do sobrenome');
            }
            if (userObject.nickname == '') {
                throw new userErrorResponse(400, 'Necessário o preenchimento do nickname');
            }
            if (userObject.nickname != undefined && userObject.nickname.length > 30) {
                throw new userErrorResponse(400, 'Máximo permitido são 30 caracteres para o nickname');
            }
            if (userObject.address == '') {
                throw new userErrorResponse(400, 'Necessário o preenchimento do endereço');
            }
            if (userObject.bio != undefined && userObject.bio.length > 100) {
                throw new userErrorResponse(400, 'Máximo permitido são 100 caracteres para a bio');
            }

            let userPresent = await User.findOne({
                where: {
                    [Op.and]: [{ id: { [Op.ne]: id } }, { nickname: { [Op.eq]: nickname } }]
                }
            });
            if (userPresent != null) {
                throw new userErrorResponse(400, 'Nickname presente no sistema');
            }

            let userUpdated = await User.update(userObject, { where: { id: { [Op.eq]: id } } });
            if (Number(userUpdated)) {
                let userFind = await User.findOne({ where: { id: { [Op.eq]: id } } });

                let hateOAS = new HATEOAS('http://localhost:3030/users');
                userFind.dataValues['_links'] = [
                    hateOAS.getHATEOAS(`?dataUser=${userFind.name}`, 'GET', 'get_users_name'),
                    hateOAS.getHATEOAS(`?dataUser=${userFind.lastName}`, 'GET', 'get_users_last_name'),
                    hateOAS.getHATEOAS(`/${userFind.nickname}`, 'GET', 'get_user_nickname'),
                    hateOAS.getHATEOAS(`/${userFind.id}`, 'DELETE', 'delete_user')
                ];

                return res.status(200).json({ code: 200, user_data: userFind });
            } else {
                return res.status(202).json({
                    code: 202,
                    user_data: {
                        id: 0, name: '', lastName: '', nickname: '',
                        address: '', bio: '', createdAt: '', updatedAt: ''
                    }
                });
            }
        } catch (err) {
            if (err instanceof TypeError) {
                return res.status(500).json({ code: 500, error: 'Erro ao fazer atualização na base de dados' });
            } else {
                return res.status(err.code).json({ code: err.code, error: err.error });
            }
        }
    },
    updateUser: async (req, res) => {
        let { id } = req.params;
        let { name, lastName, nickname, address, bio } = req.body;
        try {

            if (name == undefined || name == '') {
                throw new userErrorResponse(400, 'Necessário o preenchimento do nome');
            }
            if (lastName == undefined || lastName == '') {
                throw new userErrorResponse(400, 'Necessário o preenchimento do sobrenome');
            }
            if (nickname == undefined || nickname == '') {
                throw new userErrorResponse(400, 'Necessário o preenchimento do nickname');
            }
            if (nickname.length > 30) {
                throw new userErrorResponse(400, 'Máximo permitido são 30 caracteres para o nickname');
            }
            if (address == undefined || address == '') {
                throw new userErrorResponse(400, 'Necessário o preenchimento do endereço');
            }
            if (bio == undefined || bio == '') {
                bio = '';
            }
            if (bio.length > 100) {
                throw new userErrorResponse(400, 'Máximo permitido são 100 caracteres para a bio');
            }

            let userPresent = await User.findOne({
                where: {
                    [Op.and]: [{ id: { [Op.ne]: id } }, { nickname: { [Op.eq]: nickname } }]
                }
            });
            if (userPresent != null) {
                throw new userErrorResponse(400, 'Nickname presente no sistema');
            }

            let userObject = { name, lastName, nickname, address, bio };

            let userUpdated = await User.update(userObject, { where: { id: { [Op.eq]: id } } });
            if (Number(userUpdated)) {
                let userFind = await User.findOne({ where: { id: { [Op.eq]: id } } });

                let hateOAS = new HATEOAS('http://localhost:3030/users');
                userFind.dataValues['_links'] = [
                    hateOAS.getHATEOAS(`?dataUser=${userFind.name}`, 'GET', 'get_users_name'),
                    hateOAS.getHATEOAS(`?dataUser=${userFind.lastName}`, 'GET', 'get_users_last_name'),
                    hateOAS.getHATEOAS(`/${userFind.nickname}`, 'GET', 'get_user_nickname'),
                    hateOAS.getHATEOAS(`/${userFind.id}`, 'DELETE', 'delete_user')
                ];

                return res.status(200).json({ code: 200, user_data: userFind });
            } else {
                return res.status(202).json({
                    code: 202,
                    user_data: {
                        id: 0, name: '', lastName: '', nickname: '',
                        address: '', bio: '', createdAt: '', updatedAt: ''
                    }
                });
            }
        } catch (err) {
            if (err instanceof TypeError) {
                return res.status(500).json({ code: 500, error: 'Erro ao fazer atualização na base de dados' });
            } else {
                return res.status(err.code).json({ code: err.code, error: err.error });
            }
        }
    }
}