const mongoose = require('mongoose')
const Restaurant = require('../restaurant') // 載入 todo model
const raw = require('../restaurant.json') // 載入 .json
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
  // 將所有餐廳文檔插入到資料庫中
  try {
    Restaurant.insertMany(raw.results);
    console.log('新增餐廳資料成功');
  } catch (err) {
    console.log(err);
  }
  console.log('done')
})