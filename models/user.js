const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 4 },
  image: { type: String },
  places: { type: Array },
});

module.exports = mongoose.model('User', userSchema);