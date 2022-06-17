const express= require('express');
const router = express.Router({mergeParams:true});

const Campground = require('../models/campground'); //import Campground model
const Review =require('../models/review')

const wrapAsync = require('../utils/wrapAsync');
const AppError = require('../utils/AppError') // self made error handler

const {reviewSchema} = require('../schemas')


const validateReview= (req,res,next)=> {
    const {error} = reviewSchema.validate(req.body)
   if (error) {
     const msg=error.details.map(el=> el.message).join(',')
     throw new AppError((msg),400)
   } else {
     next();
   }
 }


router.post('/',validateReview,wrapAsync(async (req,res,next)=> {
    const campground= await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
     }));
    
    
router.delete('/:reviewId',wrapAsync(async(req,res)=> {
        const {id,reviewId} =req.params;
      await Campground.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    
    res.redirect(`/campgrounds/${id}`)
 }))

     module.exports= router