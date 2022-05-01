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

const login = async (req, res, next) => {
  const errors = validationResult(req);
  let identify;

  if (!errors.isEmpty()) {
    return next(new HttpError('Valiation error', 422));
  }

  const { email, password } = req.body;

  try {
    identify = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError('Login failed', 500));
  }

  if (!identify) {
    return next(new HttpError(`No user found with email ${email}`, 401));
  }

  if (identify.password !== password) {
    return next(new HttpError(`Wrong password for ${email}`, 401));
  }

  if (identify.password === password) {
    res.json({ message: 'logged in', id: identify.id, username: identify.username, email: identify.email }, 200);
  }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;