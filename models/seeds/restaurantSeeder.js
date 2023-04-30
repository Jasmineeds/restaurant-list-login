const db = require('../../config/mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')
const SEED_RESTAURANT = require('../restaurant.json').results // restaurant raw data in json
const SEED_USER = require('../user.json') // user raw data in json
const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

db.once('open', () => {
  console.log('running restaurantSeeder script...')

  // gen seed user info in db
  const createUsers = SEED_USER.map(user => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(user.password, salt))
      .then(hash =>
        User.create({
          name: user.name,
          email: user.email,
          password: hash
        })
      )
  })

  // gen seed user's restaurant data in db
  Promise.all(createUsers)
    .then(users => {
      const createRestaurants = []
      users.forEach((user, index) => {
        const { _id } = user
        SEED_USER[index].userRestaurants.forEach(item => {
          const restaurant = SEED_RESTAURANT[item - 1]
          restaurant.userId = _id
          createRestaurants.push(Restaurant.create(restaurant));
        })
      })
      return Promise.all(createRestaurants);
    })
    .catch(error => {
      console.error(error)
    })
    .then(() => {
      console.log('done.')
      process.exit()
    })
})