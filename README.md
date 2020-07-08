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
 5. 設定種子資料
 ```
  $ npx sequelize db:seed:all
 ```
 5. 執行
 ``` 
  $ npm run dev
 ```

# 功能
### 前台
* 使用者可以註冊帳號、登入、登出網站
* 可以瀏覽所有餐廳、可以瀏覽單一餐廳詳細資料
* 瀏覽所有餐廳時，可以用分類篩選餐廳
* 可以對餐廳留言評論
* 可以編輯自己的個人資料
### 後台
* 只有網站管理者可以登入後台
* 管理者可以在後台管理餐廳資料、變更使用者權限
* 管理者可以在後台管理餐廳分類

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