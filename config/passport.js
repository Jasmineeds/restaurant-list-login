const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  // init Passport module
  app.use(passport.initialize())
  app.use(passport.session())
  // set Local Strategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          // console.log('That email is not registered!')
          return done(null, false, { message: 'That email is not registered!' })
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            // console.log('Email or password is not correct.')
            return done(null, false, { message: 'Email or password is not correct.' })
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  })
  )

  // set Facebook Strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
    (accessToken, refreshToken, profile, done) => {
      const { name, email } = profile._json
      User.findOne({ email })
        .then(user => {
          if (user) return done(null, user)

          // create random password for required schema for facebook login user
          const randomPassword = Math.random().toString(36).slice(-8)
          bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => User.create({
              name,
              email,
              password: hash
            })
              .then(user => done(null, user))
              .catch(err => done(err, false))
            )
        }
        )
    }
  ))

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