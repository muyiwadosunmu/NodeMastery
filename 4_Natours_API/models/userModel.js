/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//name, email, photo, password, password confirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `A User must have a name`],
  },
  email: {
    type: String,
    required: [true, `Email is required`],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, `Please provide a valid email`],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, `Please provide a passowrd`],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, `Please Confirm your password`],
    validate: {
      // This only works on create() and save();
      validator: function (el) {
        return el === this.password; //abc === xyz
      },
      message: `Passwords do not match`,
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  // only run this function if password is modified
  if (!this.isModified('password')) return next();
  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Deletes the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    console.log(this.passwordChangedAt, JWTTimestamp);
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
