# Restaurant-forum
使用 Node.js + Express + MySQL 打造的練習作品，餐廳論壇。

# 安裝流程
 1. 終端機輸入
 ``` 
  $ git clone https://github.com/re711/restaurant-forum.git
 ```
 2. 安裝套件
 ``` 
  $ npm install
 ```
 3. 設定 .env 檔案 
 ```
  $ touch .env
 ```
 4. 將 API Key 儲存在 .env 檔案中並保存
 ```
  IMGUR_CLIENT_ID=你的應用程式編號
 ```
 5. 執行
 ``` 
  $ npm run dev
 ```

# 功能
1. 使用Email註冊帳號、登入驗證功能
2. 餐廳後台 CRUD 功能、使用者權限管理
3. 前台等功能..施工中...

# 測試帳號
發布於 Heroku 平台 https://restaurant-forum-express.herokuapp.com/signin
```
email: root@example.com
password: 12345678
```

# 工具
* Node.js
* Express
* Express-handlebars
* Bootstrap
* MySQL
* express-session
* passport