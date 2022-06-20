const Campground = require("../models/campground");

const objectid = require("mongoose").Types.ObjectId;

const wrapAsync = require("../utils/wrapAsync");
// module.exports.index = async(req,res,next)=> {
//     // const campgrounds= await Campground.find({});
//     // res.render('/index', {campgrounds})
//     res.render('index')
// }

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createNewCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id; // thanks to passport
  await campground.save();
  req.flash("success", "Successfully made a new campground");
  res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.showCampground = async (req, res, next, err) => {
  const { id } = req.params;
  if (!objectid.isValid(id)) {
    req.flash("error", "cast error Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};
module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "cannot find that campground!");
    return res.redirect("/campground");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash("success", "Successfully updated campgrounds");
  res.redirect("/campgrounds");
};

module.exports.deleteCampground = async (req, res, next) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect("/campgrounds");
};
