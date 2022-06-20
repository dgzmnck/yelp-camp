const express = require("express");
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campground"); //import Campground model
const Review = require("../models/review");
const reviews = require("../controllers/reviews");

const wrapAsync = require("../utils/wrapAsync");
const AppError = require("../utils/AppError"); // self made error handler

const { reviewSchema } = require("../schemas");

const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");

router.post("/", isLoggedIn, validateReview, wrapAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviews.deleteReview)
);

module.exports = router;
