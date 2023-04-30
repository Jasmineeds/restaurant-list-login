const express = require("express")
const router = express.Router()
const Restaurant = require("../../models/restaurant")

// view user's restaurants
router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// search bar
router.get('/search', (req, res) => {
  const keywords = req.query.keywords
  const userId = req.user._id
  Restaurant.find(({ name: { $regex: keywords, $options: 'i' } } || { category: { $regex: keywords, $options: 'i' } }) && { userId })
    .lean()
    .then(restaurants => res.render('index', { restaurants, keywords }))
    .catch(error => console.error(error))
})

module.exports = router