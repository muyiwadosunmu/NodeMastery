/* eslint-disable import/no-extraneous-dependencies */
const crypto = require('node:crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//name, email, photo, password, password confirm

const userSchema = new mongoose.Schema(
  {
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
    role: {
      type: String,
      enum: ['admin', 'user', 'guide', 'lead-guide'],
      default: 'user',
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
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre('save', async function (next) {
  // only run this function if password is modified
  if (!this.isModified('password')) return next();
  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Deletes the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//A regex to apply the middleware function starting witth find
userSchema.pre(/^find/, function (next) {
  //this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  // False means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  //We're sending back the unemcrypted reset token.
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
