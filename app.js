// app.js
// require packages used in the project
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = 3000
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // connect to mongoDB

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
// request monitored by bodyparser
app.use(bodyParser.urlencoded({ extended: true }))

// set routes
app.get('/', (req, res) => {
  Restaurant.find() // take data from Restaurant model
    .lean() // transform objects in Mongoose Model to JavaScript data
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// create new restaurant data
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

// app.post('/restaurants', (req, res) => {
//   const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
//   return Restaurant.create({ name })     // 存入資料庫
//     .then(() => res.redirect('/')) // 新增完成後導回首頁
//     .catch(error => console.log(error))
// })

// search bar
app.get('/search', (req, res) => {
  const keywords = req.query.keywords
  Restaurant.find({ name: { $regex: keywords, $options: 'i' } })
    .lean()
    .then(restaurants => res.render('index', { restaurants, keywords }))
    .catch(error => console.error(error))
})

// render each restaurant content
app.get('/restaurants/:id', (req, res) => {
  Restaurant.findOne({ id: req.params.id })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})