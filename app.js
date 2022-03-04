const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places');

const app = express();

app.use('/api/places', placesRoutes);

app.use((err, req, res, next) => { 
  if (res.headerSent) {
    return next(err);
  }

  res.status(err.code || 500);
  res.json({ message: err.message || 'Unknown server error' });
});

console.log('App listening at 5000');
app.listen(5000);