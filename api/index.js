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

// *新增
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
    res.send({ success: true, message: '新增成功', id: result._id })
  } catch (error) {
    // 要回應相對的 錯誤地方
    const key = Object.keys(error.errors)[0]
    const message = error.errors[key].message
    res.status(400)
    res.send({ success: false, message })
  }
})

// !監聽
app.listen(3010, () => {
  // npm run dev
  console.log('網頁伺服器已啟動')
  console.log('http://localhost:3010')
})
