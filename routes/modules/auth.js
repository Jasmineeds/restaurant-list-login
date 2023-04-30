const express = require('express')
const router = express.Router()
const passport = require('passport')

// request Facebook login
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))
// auth Facebook login
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}
))

module.exports = router