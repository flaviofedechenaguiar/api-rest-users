const express = require('express');
const userController = require('../controllers/user.controller.js');
const Auth = require('../middleware/authenticate.js');
const router = express.Router();

router.get('/', Auth, userController.findUsers);
router.get('/:nickname', Auth, userController.findUserByNickname);
router.post('/', userController.createUser);
router.patch('/:id', Auth, userController.updateUserPartial);
router.post('/:id', Auth, userController.updateUser);
router.delete('/:id', Auth, userController.deleteUser);

module.exports = router;