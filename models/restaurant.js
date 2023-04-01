const mongoose = require('mongoose')
const Schema = mongoose.Schema
const RestaurantSchema = new Schema({
  id: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  },
  name: {
    type: String,
    required: true
  },
  name_en: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true, // 設定為唯一
  },
  google_map: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1.0,
    max: 5.0 // 限制範圍在 1 到 5 之間，小數點後一位
  },
  description: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('restaurant', RestaurantSchema)