// 網頁 server
import express from 'express'
// 讓 express 可以讀取 post 資料
import bodyParser from 'body-parser'

// 引入 db.js檔
import db from './api/db.js'

// 使網頁可以成為 server
const app = express()

// 使用：讓 express 可以讀取 post 資料，並轉成 JSON 格式檔
app.use(bodyParser.json())