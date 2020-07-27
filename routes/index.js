// This is any route that isn't followed e.g /user || /profile
// It is for something top level like /dashboard || /login || /
const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Blog = require('../models/Blog')

// Login page route '/login' && Protecting routes

router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

// Dashboard page route '/dashboard'
router.get('/dashboard', ensureAuth, async (req, res) => {
  //Getting stories from DB
  try {
    // Finding all blogs by a single user && using the lean function with return a js object to use
    const blogs = await Blog.find({ user: req.user.id }).lean()
    res.render('dashboard', { name: req.user.displayName, blogs })
  } catch (err) {
    console.error(err)
    // Rendering an error page
    res.render('error/500')
  }
})

module.exports = router
