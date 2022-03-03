const express = require('express');

const router = express.Router();

const DUMMY_DATA = [
  {
    id: 'p1',
    title: 'Changu',
    description: 'heh',
    creator: 'u1',
  }
]

router.get('/:id', (req, res, next) => {
  const placeId = req.params.id;
  const place = DUMMY_DATA.find(p => {
    return p.id === placeId;
  });

  if (!place) {
    const error = new Error('No place found');
    error.code = 404;
    throw error;
  }

  console.log('GET');
  res.json({ place });
});

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid;

  const place = DUMMY_DATA.find(p => {
    return p.creator === userId;
  });

  if (!place) {
    const error = new Error('User doesn\'t have any place');
    return next(error);
  }

  res.json({ place });
});

module.exports = router;