const express = require('express');

const router = express.Router();

const placesController = require('../controllers/places');

router.get('/:id', placesController.getPlaceById);

router.get('/user/:uid', placesController.getPlaceByUserId);

module.exports = router;