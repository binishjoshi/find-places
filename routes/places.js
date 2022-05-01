const express = require('express');

const { check } = require('express-validator');

const router = express.Router();

const placesController = require('../controllers/places');

router.get('/:id', placesController.getPlaceById);

router.get('/user/:username', placesController.getPlacesByUsername);

router.post(
  '/',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description')
      .isLength({ min: 5 }),
    check('creator')
      .not()
      .isEmpty(),
  ],
  placesController.createPlace);

router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description')
      .isLength({ min: 5 }),
  ],
  placesController.updatePlace);

router.delete('/:pid', placesController.deletePlace);

module.exports = router;