const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Blog = require('../models/Blog')

// add page route '/add' && Protecting routes

router.get('/add', ensureAuth, (req, res) => {
  res.render('blogs/add')
})

// handle add form route '/blogs' && Protecting routes

router.post('/', ensureAuth, async (req, res) => {
  try {
    // Linking the posted blog to the user
    req.body.user = req.user.id

    // Saving to DB
    await Blog.create(req.body)

    // Redirecting
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// Show all blogs
router.get('/', ensureAuth, async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'public' }) // Getting all public blogs, where status == public
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('blogs/index', {
      blogs,
    })
  } catch (err) {
    console.error(err)
    res.redirect('error/500')
  }
})

// Show one blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id })
      .lean()
      .populate('user')

    res.render('blogs/singleBlog', {
      blog,
    })
  } catch (err) {
    console.error(err)
  }
})

// handle edit form route '/blogsId'

router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    // Getting the req blog from DB
    let blog = await Blog.findOne({
      // Getting the id from url param
      _id: req.params.id,
    }).lean()

    if (!blog) {
      // if blog does not exist
      return res.render('error/404')
    }

    // Preventing a user try to access another user's blog
    if (blog.user != req.user.id) {
      res.redirect('/blogs')
    } else {
      res.render('blogs/edit', {
        blog,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// handle blog update form route '/Id'

router.put('/:id', ensureAuth, async (req, res) => {
  try {
    // Getting the req blog from DB
    let blog = await Blog.findById(req.params.id).lean()

    if (!blog) {
      // if blog does not exist
      return res.render('error/404')
    }

    // Preventing a user try to access another user's blog
    if (blog.user != req.user.id) {
      res.redirect('/blogs')
    } else {
      blog = await Blog.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// handle blog delete form route '/Id'

router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    // Getting the req blog from DB
    let blog = await Blog.findById(req.params.id).lean()

    if (!blog) {
      // if blog does not exist
      return res.render('error/404')
    }

    // Preventing a user try to access another user's blog
    if (blog.user != req.user.id) {
      return res.redirect('/dashboard')
    } else {
      await Blog.deleteOne({ _id: req.params.id })
      // res.status(200).send('success')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

module.exports = router
