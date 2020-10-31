const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role:{
    type: String,
    default: "User"
  },
  password: {
    type: String,
    required: true
  },
  numbOfFamilyMembers:{
    type: Number,
    default: 1
  },
  isCovidPositive: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
