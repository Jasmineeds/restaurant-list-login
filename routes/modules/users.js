const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password } = req.body
  User.create({ name, email, password })
  res.redirect('/users/login')
})

router.get('/logout', (req, res) => {
  // req.flash('success_msg', '您已成功登出．')
  req.logout()
  res.redirect('/users/login')
})

module.exports = router