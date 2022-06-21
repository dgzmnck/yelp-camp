const express = require("express");
const router = express.Router();

const Campground = require("../models/campground"); //import Campground model

const Review = require("../models/review");

const campgrounds = require("../controllers/campgrounds");

const wrapAsync = require("../utils/wrapAsync");

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const { default: mongoose } = require("mongoose");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// router.get('/',wrapAsync(campgrounds.index))

router
  .route("/")
  .get(wrapAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    wrapAsync(campgrounds.createNewCampground)
  );

//=====================================================NEW
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

//SHOW :ID
router
  .route("/:id")
  .get(wrapAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    wrapAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground));

//EDIT
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.renderEditForm)
);

module.exports = router;
