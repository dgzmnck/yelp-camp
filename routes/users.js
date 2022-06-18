const express=require('express')
const router = express.Router();

const User= require('../models/user')

const wrapAsync= require('../utils/wrapAsync')

 const passport=require('passport')
// const LocalStrategy = require('passport-local')



router.get('/register',(req,res)=> {
    res.render('users/register')
})
router.post('/register',wrapAsync(async (req,res,next)=> {
    try {

  
    const {email,password,username} = req.body;
    const user = new User({email,username})
    const newUser = await User.register(user,password)

    req.login(newUser, err => {
        if(err) return next(err);
        req.flash('success','Registered and loggedin')
        res.redirect("/campgrounds");
      });



} catch (e) {

req.flash('error',e.message)
res.redirect('register')
}


}))


router.get('/login',(req,res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), (req,res)=> {

    req.flash('success','you are logged in now')
    console.log("ON LOGIN:",req.session)
    const redirectUrl = res.locals.returnUrl || '/campgrounds'
 delete res.locals.returnUrl
    res.redirect(redirectUrl)
})

router.get("/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      req.flash('success','logged you out')
      res.redirect("/campgrounds");
    });
  });






  
  

module.exports = router
