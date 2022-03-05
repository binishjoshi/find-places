const uuid = require('uuid');

const HttpError = require('../models/http-error');

let DUMMY_DATA = [
  {
    id: 'p1',
    title: 'Changu',
    description: 'heh',
    creator: 'u1',
  }
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.id;
  const place = DUMMY_DATA.find(p => {
    return p.id === placeId;
  });

  if (!place) {
    const error = new HttpError('No place found.', 404);
    throw error;
  }

  res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const place = DUMMY_DATA.find(p => {
    return p.creator === userId;
  });

  if (!place) {
    const error = new HttpError('User doesn\'t have any place', 404);
    return next(error);
  }

  res.json({ place });
};

const createPlace = (req, res, next) => {
  const { title, description, creator } = req.body;

  const newPlace = {
    id: uuid.v4(),
    title,
    description,
    creator
  };

  DUMMY_DATA.push(newPlace);

  res.status(201).json({ place: newPlace });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const placeToUpdate = { ...DUMMY_DATA.find(p => p.id === placeId) };
  const placeIndex = DUMMY_DATA.findIndex(p => p.id === placeId)
  placeToUpdate.title = title;
  placeToUpdate.description = description;

  DUMMY_DATA[placeIndex] = placeToUpdate;

  res.status(200).json({ place: placeToUpdate });
};

const deletePlace = (req, res, next) => { 
  const placeId = req.params.pid;
  DUMMY_DATA = DUMMY_DATA.filter(p => placeId !== p.id);
  res.status(200).json();
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;