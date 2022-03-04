const HttpError = require('../models/http-error');

const DUMMY_DATA = [
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

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;