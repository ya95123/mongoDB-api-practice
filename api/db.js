// 引入
import mongoose from 'mongoose'
import beautifyUnique from 'mongoose-beautiful-unique-validation'
// import validator from 'validator'

const Schema = mongoose.Schema

// TODO↓ 這是 validator 使用的東西 再問一下老師
// mongoose.set('useCreatIndex', true)
// 連線本機的 shop 資料庫
mongoose.connect('mongodb://127.0.0.1:27017/product', { useNewUrlParser: true, useUnifiedTopology: true })
// 使用
mongoose.plugin(beautifyUnique)

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, '商品名稱必填'],
    minlength: [1, '商品名稱至少輸入1個字'],
    maxlength: [12, '商品名稱最多輸入12個字']
  },
  price: {
    type: Number,
    required: [true, '商品價格必填']
  },
  // 商品說明
  description: {
    type: String
  },
  // 商品庫存
  count: {
    type: Number,
    required: [true, '庫存數量必填']
  }
})

const product = mongoose.model('products', productSchema)

// 預設匯出
export default {
  product
}
