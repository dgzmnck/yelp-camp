

module.exports.isLoggedIn = (req,res,next)=> {
    if( !req.isAuthenticated()) {
        req.session.returnUrl=req.originalUrl;
        req.flash('error','You must be logged in to do this action.')
        return res.redirect('/login')
    }
   next()
}