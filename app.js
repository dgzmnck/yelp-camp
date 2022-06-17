const express = require ('express'); //import express
const path =require('path'); //import path - used for the views folder
const mongoose = require('mongoose'); //import mongoose
const ejsMate= require('ejs-mate')
const session = require('express-session') // npm i express-session
const flash = require('connect-flash')// npm i connect-flash   //493

const Campground = require('./models/campground'); //import Campground model
const Review =require('./models/review')

const campgrounds = require('./routes/campgrounds')

const reviews = require('./routes/reviews')



const methodOverride= require('method-override')


const Joi= require('joi')
const {campgroundSchema,reviewSchema} = require('./schemas')

const AppError = require('./utils/AppError') // self made error handler

const wrapAsync = require('./utils/wrapAsync');
// const { nextTick } = require('process');


//======CONNECTION TO MONGO DATABASE==================
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewURLParser:true,
    useUnifiedTopology:true,

});
//==================================================


const db = mongoose.connection;  // assigning variable db to shorten calling mongoose.connection

//======ERROR HANDLING FOR CONNECTING TO MONGO==================
db.on("error",console.error.bind(console,"connection error: "));
db.once("open",()=> {
    console.log("Database connected");
});
//==================================================
 
const app = express(); //EXPRESS APP
app.engine('ejs',ejsMate) //ASSIGN EJS MATE AS ENGINE NOT THE DEFAULT
app.set('view engine','ejs'); //ASSIGN EJS AS VIEW ENGINE
app.set('views',path.join(__dirname,'views')); //ASSIGN VIEWS TO DIRNAME/VIEWS FOLDER
app.use(express.urlencoded({extended:true})) //PARSE REQ.BODY
app.use(methodOverride('_method'))


// app.use(express.static('public')) 
app.use(express.static(path.join(__dirname,'public'))) // make public folder accessible //491


//-----492======
const sessionConfig= {
  secret: 'thisisthesecretforthissession',
  resave:false,
  saveUninitialized:true,
  cookie: {
    httpOnly:true,
    expires :Date.now() + 1000*60*60*24*7,
    maxAge:  1000*60*60*24*7
  }
}
app.use(session(sessionConfig));//492
app.use(flash());//493
// req.flash('key','value') - storing
//res.flash('key') - calling

//=============================
//RES.LOCALS makes a variable accessible to all res
app.use((req,res,next)=> {
  res.locals.success= req.flash('success');
  res.locals.error = req.flash('error')
  next()
})



app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)

//INDEX
app.get('/',wrapAsync(async(req,res,next)=> {
   
        const campgrounds= await Campground.find({});
        res.render('campgrounds/index', {campgrounds})
}))



// const handleValidationErr = err => {
//     return new AppError(`Validation failed ...${err.message}`,400)
// }

app.use((err,req,res,next) => {


    if (err.name ==='ValidationError') err = handleValidationErr(err) 
    next(err)
})




app.all('*',(req,res, next) => {
   next(new AppError('Page not found',404)) 
})
app.use((err,req,res,next)=> {

    const {status = 500} = err;
    if(!err.message) err.message='Something went wrong'
    res.status(status).render('error',{err});

})



//STARTING EXPRESS SERVER ON PORT 3000
app.listen(3000,() => {
    console.log('Serving on Port 3000')
})


