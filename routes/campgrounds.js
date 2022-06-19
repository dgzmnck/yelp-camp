const express= require('express')
const router = express.Router()

const Campground = require('../models/campground'); //import Campground model
const Review =require('../models/review')


const wrapAsync = require('../utils/wrapAsync');


const { isLoggedIn,validateCampground,isAuthor} =require('../middleware');
const { default: mongoose } = require('mongoose');








router.get('/',wrapAsync(async(req,res,next)=> {
        const campgrounds= await Campground.find({});
        res.render('campgrounds/index', {campgrounds})
}))

//=====================================================NEW
router.get('/new',isLoggedIn,(req,res)=> {
  
    res.render('campgrounds/new')
})

//=====================================================POST NEW
router.post('/',isLoggedIn,validateCampground,wrapAsync(async(req,res,next)=> {

    // if(!req.body.campground) throw new AppError('Invalid campground data',400)
   
    const campground=new Campground(req.body.campground)
    campground.author= req.user._id ; // thanks to passport
    await campground.save();
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`) 
}))

//SHOW :ID
router.get('/:id',wrapAsync(async (req,res,next,err)=> {
  const {id} = req.params;
  if(! mongoose.Types.ObjectId.isValid(id)) {
    req.flash('error','cast error Cannot find that campground')
    return res.redirect('/campgrounds')
  }

    const campground= await Campground.findById(id).populate({
    path:'reviews',
    populate: {
      path:'author'
    }
    }).populate('author');
    if (!campground) {
        req.flash('error','Cannot find that campground')
          return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}))

//EDIT
router.get('/:id/edit',isLoggedIn,isAuthor,wrapAsync(async(req,res,next)=> {
  const {id} =req.params;
  const campground= await Campground.findById(id)
  if (!campground) {
    req.flash('error','cannot find that campground!')
return res.redirect('/campground')
  }
        res.render('campgrounds/edit',{campground})
}))

//update
router.put('/:id',isLoggedIn,isAuthor,validateCampground,wrapAsync(async(req,res,next)=>{


   const {id} =req.params;
   const camp =  await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated campgrounds')
    res.redirect('/campgrounds')
}))

//delete
router.delete('/:id', isLoggedIn ,isAuthor,wrapAsync(async(req,res,next)=> {
        await Campground.findByIdAndDelete(req.params.id)
        res.redirect('/campgrounds')
}))


 

 module.exports = router