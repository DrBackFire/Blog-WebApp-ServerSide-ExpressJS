const express = require('express');
const passport = require('passport');
const router = express.Router();

// Auth with Google route '/auth/google'
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google CallBack route '/auth/google/callback'
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) =>
    // Successful authentication, redirect home.
    res.redirect('/dashboard')
);

// LogOut user route '/auth/logout/

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
