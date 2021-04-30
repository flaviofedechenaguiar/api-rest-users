const express = require('express');
const userController = require('../controllers/user.controller.js');
const router = express.Router();

const User = require('../models/user.model.js');

router.get('/', userController.findUsers);
router.get('/:nickname', userController.findUserByNickname);
router.post('/', userController.createUser);
router.patch('/:id', userController.updateUserPartial);
router.post('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;