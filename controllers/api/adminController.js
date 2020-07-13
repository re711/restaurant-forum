const db = require('../../models')

const Restaurant = db.Restaurant

const Category = db.Category

const adminController = {
  // 餐廳後台
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: [Category]
    }).then(restaurants => {
      return res.json({ restaurants: restaurants })
    })
  }
}

module.exports = adminController
