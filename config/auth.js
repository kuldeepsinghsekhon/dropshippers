
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      res.locals.role = req.user.role;
      res.locals.name = req.user.name;
      res.locals.paypalEmail = req.user.paypalEmail; 
      return next();  
      if(!validated){
        req.flash('error_msg', 'Please Check tour email  and Validate Account');
        res.json({status:'error',message:'Email Or password are incorrect '});
       // res.redirect('/sign-in');
      }
    }
   // res.json({status:'error',message:'Email Or password are incorrect '});
   // req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/sign-in');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      res.locals.name = 'guest';
      res.locals.role = '';
    }else{
      res.locals.role = req.user.role;
      res.locals.name = req.user.name; 
      res.locals.paypalEmail = req.user.paypalEmail; 
    }
    return next();
    //res.redirect('/');      
  }
};

