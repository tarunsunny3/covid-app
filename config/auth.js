const checkRole = (role)=>{
  return (req, res, next)=>{
    if(req.user.role !== role){
        return res.redirect('/users/login');
    }
    return next();
  }
}
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    //isAuthenticated comes from the passport js which we have included in config/passport.js
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    //If the user is not authenticated then redirect him to login page
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) {
    //isAuthenticated comes from the passport js which we have included in config/passport.js
    if (!req.isAuthenticated()) {
      return next();
    }
    //If the user is VALID then take him to dashboard page.
    if(req.user.role==="Admin"){
      return res.redirect('/dashboard-admin');
    }else{
      res.redirect('/dashboard'); 
    }
         
  },
  checkRole
  
};
