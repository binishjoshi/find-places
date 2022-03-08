const uuid = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'lel',
    email: 'lel@pm.me',
    password: 'lel123456'
  }
]

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError('Dumb bitch', 422);
  }

  const { username, email, password } = req.body;

  const hasUser = DUMMY_USERS.find(u => u.email === email);

  if (hasUser) {
    throw new HttpError(`Account with ${email} already exists.`, 422);
  }

  const createdUser = {
    id: uuid.v4(),
    username,
    email,
    password
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError('Valiation error', 422);
  }

  const { email, password } = req.body;

  const identify = DUMMY_USERS.find(u => email === u.email);

  if (!identify) {
    throw new HttpError(`No user found with email ${email}`, 401);
  }

  if (!password) {
    throw new HttpError('Try entering password before you login you dimwit', 401);
  }

  console.log(password);
  console.log(identify.password);

  if (identify.password !== password) {
    throw new HttpError(`Wrong password for ${email}`, 401);
  }

  if (identify.password === password) {
    res.json({ message: 'logged in' });
  }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;