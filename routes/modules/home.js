const express = require("express")
const router = express.Router()
const Restaurant = require("../../models/restaurant")

// view all restaurants
router.get('/', (req, res) => {
  Restaurant.find() // take data from Restaurant model
    .lean() // transform objects in Mongoose Model to JavaScript object
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// search bar
router.get('/search', (req, res) => {
  const keywords = req.query.keywords
  Restaurant.find({ name: { $regex: keywords, $options: 'i' } } || { category: { $regex: keywords, $options: 'i' } })
    .lean()
    .then(restaurants => res.render('index', { restaurants, keywords }))
    .catch(error => console.error(error))
})

module.exports = router