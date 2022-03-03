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
    return res.status(404).json({ message: 'Place not found' });
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
    return res.status(404).json({ message: 'User doesn\'t have any place'})
  }

  res.json({ place });
});

module.exports = router;