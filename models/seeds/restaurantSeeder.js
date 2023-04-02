const mongoose = require('mongoose')
const Restaurant = require('../restaurant') // todo model
const raw = require('../restaurant.json') // raw data in restaurant.json

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  console.log('running restaurantSeeder script...')
  // restaurant data send to database
  try {
    Restaurant.insertMany(raw.results);
    console.log('restaurant data added');
  } catch (err) {
    console.log(err);
  }
  console.log('done!')
})