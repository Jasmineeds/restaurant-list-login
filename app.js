const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')

const routes = require("./routes")
const usePassport = require('./config/passport')
const passport = require('passport')
require("./config/mongoose")

const app = express()
const PORT = process.env.PORT || 3000

app.engine('hbs', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
usePassport(app)
// use flash to show messages
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
// use middleware to save data in res.locals which can be access by all views
app.use((req, res, next) => {
  console.log(req.user)
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

// start and listen on the Express server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})