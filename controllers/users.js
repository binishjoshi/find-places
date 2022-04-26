const uuid = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find();
  } catch (err) {
    const error = new HttpError('No users', 500);
    return next(error);
  }
  res.status(200).json({ users });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  const { username, email, password } = req.body;

  if (!errors.isEmpty()) {
    let errorMessage = 'Invalid input/s: '
    let invalidFields = [];
    errors.errors.forEach(errObj => {
      invalidFields.push(errObj.param);
      errorMessage += `${errObj.param} `;
    });
    return next(new HttpError(errorMessage, 422, { invalidFields }));
  }

  const createdUser = User({
    id: uuid.v4(),
    username,
    email,
    password
  });

  try {
    await createdUser.save();
  } catch (err) {
    if (err.code === 11000) {
      let field = Object.keys(err.keyValue)[0];
      let value = err.keyValue[field];
      return next(new HttpError(`Account with ${field} ${value} already exists. `, 500))
    }
    const error = new HttpError('Signup failed', 500);
    return next(error);
  }

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