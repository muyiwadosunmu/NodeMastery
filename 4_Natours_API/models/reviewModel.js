//review / ratinng / createdAt / Referenceto Tour and User
const mongoose = require('mongoose');
const validator = require('validator'); //Not later used
const slugify = require('slugify');
const User = require('./userModel');
const Tour = require('./tourModels');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//DOCUMENT MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

/**The code below is middleware function that allows us to be able to use statics method on our model  */
reviewSchema.post('save', function () {
  // This points to current review
  this.constructor.calcAverageRatings(this.tour);
});

/**findByIdAndUpdate
 * findByIdAndDelete
 * NB=> We do not actually have document middleware for these but only query middleware. In query we actually don't have direct access to document to do something similar to above, we need access to the current review so that from there we can extract the tourId, then calculate the statistics
 */
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.revi = await this.findOne({}).clone(); // Used .clone() an hack around
  // console.log(this.revi);
  next();
});

/**The =this= above was used to pass data from the premiddleware to the post middleware, we retrieved the review document from the =this= variable */

reviewSchema.post(/^findOneAnd/, async function () {
  /**await this.findOne(); does NOT work here , because query has already executed */
  await this.revi.constructor.calcAverageRatings(this.revi.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

// POST /tour/234fad4/reviews
// GET /tour/234fa95/reviews
// GET /tour/234fb66/reviews/94521da
