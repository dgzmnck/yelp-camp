//require mongoose
const mongoose = require('mongoose');
//store mongoose.Schema to variable Schema to shortened
const Schema = mongoose.Schema;

//create Schema for Campground , just like database or collection
const reviewSchema = new Schema({
    body: String,
    rating: Number
});


//LONG VERSION
// const Campground = mongoose.model('Campground',CampgroundSchema);
// module.exports= Campground;

//SHORTENED VERSION
module.exports= mongoose.model('Review',reviewSchema);
