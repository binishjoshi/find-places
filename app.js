const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places');
const usersRoutes = require('./routes/users');

const app = express();

const HttpError = require('./models/http-error');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

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
  .connect('mongodb+srv://mongod:aPryNq3PSQglaVxg@cluster0.ufx2e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(() => {
    console.log('App listening at 5000');
    app.listen(5000);

  })
  .catch(err => {
    console.log(err);
  });