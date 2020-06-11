// 網頁 server
import express from 'express'
// 讓 express 可以讀取 post 資料
import bodyParser from 'body-parser'

// 引入 db.js檔
import db from './db.js'

// 使網頁可以成為 server
const app = express()

// 使用：讓 express 可以讀取 post 資料，並轉成 JSON 格式檔
app.use(bodyParser.json())

// *新增---------------------------------------------OK
app.post('/new', async (req, res) => {
  // -拒絕非 JSON 格式
  if (req.headers['content-type'] !== 'application/json') {
    // 回傳錯誤碼
    res.status(400)
    res.send({ success: false, message: '格式不符，請用 application/json 格式' })
    return
  }
  // -檢查必填內容 (描述 description 為非必填內容)
  if (req.body.name === undefined ||
    req.body.price === undefined ||
    req.body.count === undefined
  ) {
    res.status(400)
    res.send({ success: false, message: '必填欄位(名稱、價格、庫存)請輸入資訊' })
    return
  }
  // 新增
  try {
    const result = await db.product.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      count: req.body.count
    })
    // 成功200 可忽略不打，因為預設為200
    // res.status(200)
    res.send({ success: true, message: '新增成功', id: result._id, name: result.name })
  } catch (error) {
    // 要回應相對的 錯誤地方
    const key = Object.keys(error.errors)[0]
    const message = error.errors[key].message
    res.status(400)
    res.send({ success: false, message })
  }
})

// *修改---------------------------------------------OK
app.patch('/update/:type', async (req, res) => {
  console.log(req.params)
  // -拒絕非 JSON 格式
  if (req.headers['content-type'] !== 'application/json') {
    // 回傳錯誤碼
    res.status(400)
    res.send({ success: false, message: '格式不符，請用 application/json 格式' })
    return
  }
  // -修改內容
  if (req.params.type !== 'name' &&
    req.params.type !== 'price' &&
    req.params.type !== 'description' &&
    req.params.type !== 'count'
  ) {
    res.status(400)
    res.send({ success: false, message: '請在 update/ 後面加上正確的修改種類，例如：update/price，並在下面輸入 id 與 data，data 內為要修改的值。' })
  }
  // 修改
  try {
    // findByIdAndUpdate 回來的 result 是更新前的資料
    // 加上 new true 後可以回來新的資料
    const result = await db.product.findByIdAndUpdate(req.body.id, { [req.params.type]: req.body.data }, { new: true })
    console.log(result)
    res.send({ success: true, message: `修改成功，你修改了 ${req.params.type} 的 ${req.body.data}。` })
  } catch (error) {
    res.status(500)
    res.send({ success: false, message: '發生錯誤' })
  }
})

// *刪除---------------------------------------------OK
app.delete('/delete', async (req, res) => {
  // -拒絕非 JSON 格式
  if (req.headers['content-type'] !== 'application/json') {
    // 回傳錯誤
    res.status(400)
    res.send({ success: false, message: '請用JSON格式輸入' })
    return
  }
  // 刪除
  try {
    const result = await db.product.findByIdAndDelete(req.body.id)
    if (result === null) {
      // 資料找不到，回傳找不到
      res.status(404)
      res.send({ success: false, message: '找不到資料' })
    } else {
      // 有找到資料，成功刪除
      res.send({ success: true, message: `${req.body.id} 已刪除` })
    }
  } catch (error) {
    res.status(500)
    res.send({ success: false, message: '發生錯誤，未刪除成功' })
  }
})

// *查詢單個商品--------------------------------------OK
// *查詢方法->直接打在網址，例：網址/product?id=...
// *http://localhost:3010/product?id=5ee21702f6797263b89d61e3
app.get('/product', async (req, res) => {
  // 如果無此資料，回傳錯誤
  if (req.query.id === undefined) {
    res.status(400)
    res.send({ success: false, message: '請輸入 id' })
    return
  }
  // 查詢
  try {
    // 使用 id 尋找資料，只取 name、去掉 id
    const result = await db.product.findById(req.query.id, 'name -_id')
    res.send({ success: true, message: '搜尋成功', name: result.name })
  } catch (error) {
    // 找不到
    res.status(404)
    res.send({ success: false, message: '查無此資料' })
  }
})

// *查詢全部商品
app.get('/all', async (req, res) => {
  try {
    // !.find() 可找出所有資料
    const result = await db.product.find()
    res.send({ success: true, message: '所有商品', products: result })
  } catch (error) {
    res.status(400)
    res.send({ success: false, message: '發生錯誤' })
  }
})

// *剩餘庫存(庫存量 > 0 的商品)
app.get('/instock', async (req, res) => {
  try {
    const result = await db.product.find({ count: { $gt: 0 } })
    res.send({ success: true, message: '庫存數大於 0 的商品', products: result })
  } catch (error) {
    res.status(400)
    res.send({ success: false, message: '發生錯誤' })
  }
})

// !監聽
app.listen(3010, () => {
  // npm run dev
  console.log('網頁伺服器已啟動')
  console.log('http://localhost:3010')
})
