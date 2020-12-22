const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  id: String,
  email: String,
  password: String,
  phone: String,
  education: String,
  address: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);