const uuid = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const Place = require('../models/place');

let DUMMY_DATA = [
  {
    id: 'p1',
    title: 'Changu',
    description: 'heh',
    creator: 'u1',
  }
];

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
  let places;

  try {
    places = await Place.find({ "creator": username });
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
    throw new HttpError('Invalid inputs passed', 422);
  }

  const { title, description, creator } = req.body;

  const newPlace = Place({
    title,
    description,
    creator
  });

  try {
    await newPlace.save();
  } catch (err) {
    const error = new HttpError('Failed creating place failed', 500);
    return next(error);
  }

  res.status(201).json({ place: newPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError('Write sth you fool', 422);
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
  try {
    const deleted = await Place.deleteOne({ "_id": placeId });
    if (deleted.deletedCount === 0) {
      res.status(204).json({ "message": "Can't find the request place to delete" });
      return;
    }
  } catch (err) {
    const error = new HttpError('Delete failed', 500);
    return next(error);
  }
  // res.json({
  //   "message": "Place deleted"
  // }, 200);
  res.status(200).json({ "message": "Place deleted" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUsername = getPlacesByUsername;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;