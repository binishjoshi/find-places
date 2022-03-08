const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const usersController = require('../controllers/users');

router.get('/', usersController.getUsers);

router.post(
  '/signup',
  [
    check('username')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password')
      .isLength({ min: 4, max: 10 })
  ],
  usersController.signup);

router.post(
  '/login',
  [
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password')
      .not()
      .isEmpty()
  ],
  usersController.login); 

module.exports = router;