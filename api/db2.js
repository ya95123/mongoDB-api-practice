import mongoose from 'mongoose'

const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/20200615')

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [2, '商品名稱至少兩個字'],
      required: [true, '商品名稱必填']
    },
    price: {
      type: Number,
      min: [0, '商品價格最小 0 元'],
      required: [true, '商品價格必填']
    },
    description: {
      type: String,
      minlength: [2, '商品說明至少兩個字'],
      required: [true, '商品說明必填']
    },
    count: {
      type: Number,
      min: [0, '商品庫存最少 0 個'],
      required: [true, '商品庫存必填']
    },
    image: {
      type: String,
      required: [true, '商品圖片必填']
    }
  },
  {
    versionKey: false
  }
)

const product2 = mongoose.model('products2', ProductSchema)

export default {
  product2
}
