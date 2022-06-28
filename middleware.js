const Campground = require("./models/campground"); //import Campground model
const Review = require("./models/review"); //import Campground model
const { campgroundSchema, reviewSchema } = require("./schemas");
const AppError = require("./utils/AppError"); // self made error handler

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.originalUrl = req.originalUrl.replace("/reviews", "");

    req.flash("error", "You must be logged in to do this action.");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "no permission to edit");
    return res.redirect(`/campgrounds/${campground._id}`);
  }
  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "no permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  console.log("FROM VALIDATE CAMPGROUND");
  console.log(req.body, req.files);
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};
