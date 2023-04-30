const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

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
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!email || !password || !confirmPassword) {
    errors.push({ message: '請輸入所需欄位' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '兩次密碼不相符．' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  // check whether email registered
  User.findOne({ email }).then(user => {
    // email registered：back to register page
    if (user) {
      errors.push({ message: 'Email 已被註冊．' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    // email not registered：write in db
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
    .catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
  req.flash('success_msg', '您已成功登出．')
  req.logout()
  res.redirect('/users/login')
})

module.exports = router