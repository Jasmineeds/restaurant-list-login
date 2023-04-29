const express = require('express')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then(user => {
      if (!user) {
        console.log('cannot find email.')
        return res.redirect('/users/login')
      }
      if (user.password !== password) {
        return res.redirect('/users/login')
      }
      return res.redirect('/')
    })
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password } = req.body
  User.create({ name, email, password })
  res.redirect('/users/register')
})

module.exports = router