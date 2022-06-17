const express= require('express')
const router = express.Router()

const Campground = require('../models/campground'); //import Campground model
const Review =require('../models/review')
const {campgroundSchema,reviewSchema} = require('../schemas')

const wrapAsync = require('../utils/wrapAsync');
const AppError = require('../utils/AppError') // self made error handler


const validateCampground = (req,res,next)=> {
    const {error} = campgroundSchema.validate(req.body)
   if (error) {
     const msg=error.details.map(el=> el.message).join(',')
     throw new AppError((msg),400)
   } else {
     next();
   }
 }





router.get('/',wrapAsync(async(req,res,next)=> {
        const campgrounds= await Campground.find({});
        res.render('campgrounds/index', {campgrounds})
}))

//=====================================================NEW
router.get('/new',(req,res)=> {

    res.render('campgrounds/new')
})

//=====================================================POST NEW
router.post('/',validateCampground,wrapAsync(async(req,res,next)=> {

    // if(!req.body.campground) throw new AppError('Invalid campground data',400)
   
    const campground=new Campground(req.body.campground)
    await campground.save();
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`) 
}))

//SHOW :ID
router.get('/:id',wrapAsync(async (req,res,next)=> {
    const campground= await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error','Cannot find that campground')
          return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}))

//EDIT
router.get('/:id/edit',wrapAsync(async(req,res,next)=> {
        const campground = await Campground.findById(req.params.id)
        if (!campground) {
            throw new AppError('Campground not found',404)
        }
        res.render('campgrounds/edit',{campground})
}))

//update
router.put('/:id',validateCampground,wrapAsync(async(req,res,next)=>{
    await Campground.findByIdAndUpdate(req.params.id,req.body.campground);
    res.redirect('/campgrounds')
}))

//delete
router.delete('/:id',wrapAsync(async(req,res,next)=> {
        await Campground.findByIdAndDelete(req.params.id)
        res.redirect('/campgrounds')
}))


 

 module.exports = router