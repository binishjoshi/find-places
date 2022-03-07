const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users');

router.get('/', usersController.getUsers);

router.post('/signup', usersController.signup);

router.post('/login', usersController.login); 

module.exports = router;