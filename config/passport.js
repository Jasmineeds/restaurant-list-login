const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  // init Passport module
  app.use(passport.initialize())
  app.use(passport.session())
  // set LocalStrategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          console.log('That email is not registered!')
          return done(null, false)
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            console.log('Email or password is not correct.')
            return done(null, false)
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  })
  )

  // serializeUser and deserializeUser
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}