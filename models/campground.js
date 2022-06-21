//require mongoose
const mongoose = require("mongoose");
//store mongoose.Schema to variable Schema to shortened
const Review = require("./review");
const Schema = mongoose.Schema;

//create Schema for Campground , just like database or collection
const campgroundSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
  // if has doc , remove all reviews with id in doc.reviews
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

//LONG VERSION
// const Campground = mongoose.model('Campground',CampgroundSchema);
// module.exports= Campground;

//SHORTENED VERSION
module.exports = mongoose.model("Campground", campgroundSchema);
