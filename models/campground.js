//require mongoose
const mongoose = require("mongoose");
//store mongoose.Schema to variable Schema to shortened
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } }; // allow virtuals ton be included when model has beed stringify

//create Schema for Campground , just like database or collection
const campgroundSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
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
  },
  opts
); //added opts at the end

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <h3><a href="/campgrounds/${this._id}">${this.title}</a></h3>
  <h5>${this.location}</h5>

  `;
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
