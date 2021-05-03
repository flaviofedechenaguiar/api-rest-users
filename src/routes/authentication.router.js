const express = require('express');
const router = express.Router();
const authentication = require('../controllers/authentication.controller');

router.post('/', authentication.authentication);

module.exports = router;