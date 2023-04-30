const db = require('../../config/mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')
const SEED_RESTAURANT = require('../restaurant.json') // restaurant raw data in json
const SEED_USER = require('../user.json') // user raw data in json
const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

db.once('open', () => {
  console.log('running restaurantSeeder script...')
  // gen seed user info in db
  Promise.all(
    SEED_USER.map(user => {
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(user.password, salt))
        .then(hash => User.create({
          name: user.name,
          email: user.email,
          password: hash
        }))
        // gen seed restaurant data in db
        .then(user => {
          const userId = user._id
          for (i = 0; i < SEED_USER.length; i++) {
            SEED_USER[i].userRestaurants.map(item => {
              SEED_RESTAURANT[item - 1].userId = userId
              Restaurant.create(SEED_RESTAURANT[item - 1])
            })
          }
        })
    })
  )
    .then(() => {
      console.log('done.')
      process.exit()
    })
})