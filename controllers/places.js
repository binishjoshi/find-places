const uuid = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.id;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('No place found', 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find a place for the provided id', 404);
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUsername = async (req, res, next) => {
  const username = req.params.username;
  let user;
  let places;

  try {
    user = await User.findOne({ "username": username });
  } catch (err) {
    return next(new HttpError(`No user with username ${username}`, 404));
  }

  try {
    places = await Place.find({ "creator": user._id });
  } catch (err) {
    const error = new HttpError('There are no places in the db');
    return next(error);
  }

  if (!places || places.length === 0) {
    const error = new HttpError('User doesn\'t have any place', 404);
    return next(error);
  }

  res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed', 422));
  }

  const { title, description, creator } = req.body;

  const newPlace = Place({
    title,
    description,
    creator
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(new HttpError('Bad user data', 500));
  }

  if (!user) {
    return next(new HttpError('User not valid', 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newPlace.save({ session: sess });
    user.places.push(newPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Failed creating place', 500);
    return next(error);
  }

  res.status(201).json({ place: newPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Write sth you fool', 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  try {
    await Place.updateOne(
      { id: placeId },
      {
        title,
        description
      }
    );
  } catch (err) {
    const error = new HttpError('There exists no such place, you fool', 500);
    return next(error);
  }

  res.status(200).json({ "message": "Updated" });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError('Delete failed', 500);
    return next(error);
  }

  if (!place) {
    return next(new HttpError('Place not found to delete', 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ sessin: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError('Delete failed', 500));
  }

  res.status(200).json({ "message": "Place deleted" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUsername = getPlacesByUsername;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;