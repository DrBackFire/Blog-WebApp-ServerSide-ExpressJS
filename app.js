const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const morgan = require("morgan")
const exphbs = require("express-handlebars")
const methodOverride = require("method-override")
const passport = require("passport")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const connectDB = require("./config/db")

// Load config
dotenv.config({ path: "./config/.env" })

// Passport config
require("./config/passport")(passport) // passing passport to config file

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Handlebars Helpers
const {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
} = require("./helpers/hbs")

// Handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, truncate, stripTags, editIcon, select },
    defaultLayout: "index",
    extname: ".hbs",
  })
)
app.set("view engine", ".hbs")

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    // Storing the session in DB.
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Global vars middleware
app.use((req, res, next) => {
  // Setting the logged in user to a global var = user to be used in any template
  res.locals.user = req.user || null

  next()
})

// Static folder
app.use(express.static("public"))

connectDB()

// Routes
app.use("/", require("./routes/index"))
app.use("/auth", require("./routes/auth"))
app.use("/blogs", require("./routes/blogs"))

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>
  console.log(`App is running in ${process.env.NODE_ENV} on port ${PORT}`)
)
