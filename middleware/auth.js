module.exports = {
  // Protecting routes
  ensureAuth: (req, res, next) => {
    // User is authenticated
    if (req.isAuthenticated()) {
      return next();
    } else {
      // User not authenticated
      res.redirect('/');
    }
  },

  // Making sure if user is logged-in then can never go to login page
  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      // Always redirected to dashboard if logged-in
      res.redirect('/dashboard');
    } else {
      return next();
    }
  },
};
