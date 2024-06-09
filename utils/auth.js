const withAuth = (req, res, next) => {
    // If user not logged in, redirect the request to the login route
    if (!req.session.logged_in) { 
        req.flash('Error', 'You must login to access this page.'); 
        // store original request URL in session for redirection after login 
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    } 
      next();
  };
  
  module.exports = withAuth;
  