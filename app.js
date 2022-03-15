const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places');
const usersRoutes = require('./routes/users');

const app = express();

const HttpError = require('./models/http-error');

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);

app.use('/api/authentication', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find route', 404);
  throw error;
});

app.use((err, req, res, next) => { 
  if (res.headerSent) {
    return next(err);
  }

  res.status(err.code || 500);
  res.json({ message: err.message || 'Unknown server error' });
});

mongoose
  .connect('mongodb://127.0.0.1:27017/someDB')
  .then(() => {
    console.log('App listening at 5000');
    app.listen(5000);

  })
  .catch(err => {
    console.log(err);
  });