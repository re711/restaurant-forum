const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const db = require('./models') // 引入資料庫
const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app)
